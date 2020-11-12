const express= require('express');
const router= express.Router()
const db= require('../models');
const isLoggedIn= require('../middleware/isLoggedIn');

//isLoggedIn is middleware that only applies to specific routes, access it because we required it at the top
router.get('/', isLoggedIn, (req, res)=> {
    res.render('profile/profile.ejs');
})

router.post('/favorites', (req, res)=> {
    console.log(req.body);
    console.log('can you access req.user', req.user); 
    if(!req.user){
        req.flash('error', 'You must be logged in to save a hike');
        console.log('NOT SIGNED IN');
        res.redirect('/'); //maybe redirect to login page 
    } else {
        db.user.findOne({
            where: {name: req.user.name}
        })
        .then(foundUser => {
            console.log('found User name', foundUser.name);
            db.hike.findOne({
                where: {title: req.body.title}
            })
            .then(foundHike => {
                console.log('found Hike', foundHike);
                foundUser.addHike(foundHike)
                .then(newRelation => {
                    console.log('new relation', newRelation);
                })
            })
        })
        //console.log(req.user);
        res.redirect('/');
    }
    
})

module.exports= router;
