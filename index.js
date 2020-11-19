require('dotenv').config();
const express= require('express');
const app= express();
const ejsLayouts= require('express-ejs-layouts');
const session= require('express-session');
const passport= require('./config/ppConfig.js');
const flash= require('connect-flash');
//const isLoggedIn= require('./middleware/isLoggedIn');
// const fileUpload= require('express-fileupload'); //to be able to upload images 
// const bodyParser= require('body-parser'); 
const methodOverride= require('method-override');
const axios= require('axios');
const fs= require('fs');
const helper= require('./helpers');
const db= require('./models');
const { get } = require('http');

//method override middleware (at top)
app.use(methodOverride('_method'));
//body parser middleware 
app.use(express.urlencoded({extended: false}));
//app.use(bodyParser.json());

//session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware (goes AFTER session middleware, it uses sessions to store the message)
app.use(flash());

//CUSTOM MIDDLEWARE
app.use((req, res, next)=> {
    //before every route, attach the flash messages and current user to res.locals
    //this will give us access to these values in all our ejs pages 
    res.locals.alerts= req.flash();
    res.locals.currentUser= req.user;
    next() //move on to the next piece of 
})

//more middleware
app.set('view engine', 'ejs');
app.use(ejsLayouts);
//app.use(fileUpload());
app.use(express.static('public')); //built in express middleware function to serve static files (images) or 


//routes middleware
app.use('/auth', require('./controllers/auth.js'));
app.use('/profile', require('./controllers/profile.js'));


//ROUTES

//get route for the home page 
app.get('/', (req, res)=> {
    //AXIOS WAY
    // axios.get(`https://www.hikingproject.com/data/get-trails?lat=47.7511&lon=-120.7401&maxResults=500&key=${process.env.KEY}`)
    // .then(apiResponse => {
    //     //res.send(apiResponse.data);
    //     res.render('home.ejs', {hikeData: apiResponse.data.trails, fxn: helper});
    // })
    // .catch(err => {
    //     console.log('AXIOS ERROR: ', err);
    // })

    //JSON WAY
    // let hikes= fs.readFileSync('./hikeData.json');
    // hikes= JSON.parse(hikes);
    // res.render('home.ejs', {hikeData: hikes, fxn: helper});
   
    //DATABASE WAY, data scraped hikes and entered info into database 
    db.hike.findAll()
    .then(hikes => {
        res.render('pages/home.ejs', {hikeData: hikes, fxn: helper});
    })
    .catch(err => {
        console.log('hike.findAll error', err);
    }) 
})


//get route to show more info on a chosen hike 
app.get('/:hikeName', (req, res)=> {
    //console.log('should be the hike name', req.params.hikeName);
    db.hike.findOne({
        where: {title: req.params.hikeName},
        include: [db.entry]
    })
    .then(foundHike => {
        //console.log('found Hike', foundHike);
        console.log('foundHike.entries', foundHike.entries);
        db.user.findAll({
            include: [db.entry]
        })
        .then(foundUsers => {
            res.render('pages/show.ejs', {hikeData: foundHike, hikeEntries: foundHike.entries, allUsers: foundUsers, fxn: helper});
        }) 
        .catch(err => {
            console.log('hike.findOne error', err);
        })      
    }) 
})


//attempt to learn
// app.get('/upload', (req, res)=> {
//     let file= req.files.profile_pics;
//     let img_name= file.name;
//     res.render('photo.ejs');
// })

app.listen(process.env.PORT || 8000, () => {
    console.log(`Listening to port ${process.env.PORT}`);
})