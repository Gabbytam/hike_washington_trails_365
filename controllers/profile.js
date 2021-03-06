const express= require('express');
const router= express.Router()
const db= require('../models');
const isLoggedIn= require('../middleware/isLoggedIn');
const helper= require('../helpers');

//isLoggedIn is middleware that only applies to specific routes, access it because we required it at the top
router.get('/', isLoggedIn, (req, res)=> {
    res.render('profile/profile.ejs');
})

//post route for adding a hike to favorites/saved list 
router.post('/favorites', (req, res)=> {
    //console.log('can you access req.user', req.user); 
    if(!req.user){
        req.flash('error', 'You must be logged in to save a hike');
        console.log('NOT SIGNED IN');
        //the post route is used in both the home and the show page, want different redirect routes depending where the user was 
        if(req.body.redirectRoute == 'show'){ //the show page has a hidden input value that passes info on what the redirectRoute should be
            res.redirect(`/${req.body.title}`)
        } else {
            res.redirect('/'); //maybe redirect to login page 
        }
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
                //db inside a db offers addHike functionality, newRelation appears in the join table 
                foundUser.addHike(foundHike)
                .then(newRelation => {
                    console.log('new relation', newRelation);
                })
                .catch(err => {
                    console.log('addHike/new relation error', err);
                }) 
            })
            .catch(err => {
                console.log('hike.findOne error', err);
            }) 
        })
        .catch(err => {
            console.log('user.findOne error', err);
        }) 
        res.redirect('/');
    }
})

//get route for viewing favorites on user profile 
router.get('/favorites', isLoggedIn, (req, res)=> {
    db.user.findOne({
        where: {name: req.user.name},
        include: [db.hike]
    })
    .then(foundUser => {
        //console.log('found user', foundUser.hikes); //hikes is plural because the relationship is many to many 
        res.render('profile/favs.ejs', {userFavs: foundUser.hikes});
    })
    .catch(err => {
        console.log('user.findOne error', err);
    })
})

//delete route to remove a favorite/saved hike 
router.delete('/favorites/:id', (req, res)=> {
    //delete route does not return a payload(req.body), does return the data in url parameter, access by (req.params.__) 
    //console.log(req.params.id);
    //to delete a saved hike, go into join table and pass in two conditions to where 
    db.UserHike.destroy({
        where: {hikeId: req.params.id, userId: req.user.id}
    })
    .then(rowsDeleted => {
        //console.log('should just be one', rowsDeleted);
        res.redirect('/profile/favorites');
    })
    .catch(err => {
        console.log('UserHike.destroy error', err);
    }) 
})

//get route for personal season calendar 
router.get('/calendar', isLoggedIn, (req, res)=> {
    db.user.findOne({
        where: {name: req.user.name},
        include: [db.hike]
    })
    .then(foundUser => {
        //console.log('savedHikes', foundUser.hikes);
        res.render('profile/calendar.ejs', {savedHikes: foundUser.hikes, fxn: helper});
    })
    .catch(err => {
        console.log('user.findOne error', err);
    }) 
})

//get route for personal blog, to see and also write blog posts
router.get('/blog', isLoggedIn, (req, res)=> {
    db.user.findOne({
        where: {name: req.user.name},
        include: [db.entry]
    })
    .then(foundUser => {
        //console.log('user\'s entries', foundUser.entries);
        db.hike.findAll()
        .then(foundHikes => {
            res.render('profile/blog.ejs', {allHikes: foundHikes, entries: foundUser.entries, fxn: helper});
        })
        .catch(err => {
            console.log('hike.findAll error', err);
        }) 
        //res.render('profile/blog.ejs', {entries: foundUser.entries});
    })
    .catch(err => {
        console.log('user.findOne error', err);
    }) 
})

//post route for personal blog posts, creates an entry for a user
router.post('/blog', (req, res)=> {
    console.log('req body', req.body);
    db.entry.create({
        body: req.body.content,
        photo: req.body.blogPic,
        hikeId: req.body.hikeId,
        userId: req.user.id
    })
    .then(createdEntry => {
        console.log('created entry', createdEntry);
    })
    .catch(err => {
        console.log('entry.create error', err);
    }) 
    res.redirect('/profile/blog');
})

//get route that lets user edit their blog post 
router.get('/blog/edit/:id', isLoggedIn, (req, res)=> {
    console.log(req.params.id);
    db.entry.findOne({
        where: {id: req.params.id},
        include: [db.hike]
    })
    .then(foundEntry => {
        //console.log('found entry', foundEntry);
        //console.log('foundEntry hike', foundEntry.hike); //singular because relationship is many to one (entries to hike)
        db.hike.findAll()
        .then(foundHikes => {
            res.render('profile/edit.ejs', {entry: foundEntry, hike: foundEntry.hike, allHikes: foundHikes, fxn: helper});
        })
        .catch(err => {
            console.log('hike.findAll error', err);
        }) 
    })
    .catch(err => {
        console.log('entry.findOne error', err);
    }) 
})

//put route for getting editted blog post info   
router.put('/blog', (req, res)=> {
    //console.log('req body', req.body);
    
    db.entry.update({ 
        photo: req.body.blogPic,
        body: req.body.content,
        hikeId: req.body.hikeId }, 
        {where: {id: req.body.entryId}
    })
    .then(numRowsChanged=> {
        console.log('rows changed:', numRowsChanged);
        res.redirect('/profile/blog');
    })
    .catch(err => {
        console.log('entry.update error', err);
    }) 
})

module.exports= router;

