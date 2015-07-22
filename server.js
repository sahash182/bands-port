//requiring modules
var express = require('express'),
    app = express(),
    _ = require('underscore'),
    cors = require('cors'),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config'),
  session = require('express-session');


//connecting to mongoDB of heroku or localhost
mongoose.connect(config.MONGO_URI);


//setting up models
var User = require('./models/user');
var Band = require('./models/band');


//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// setting view engine to render html files
// app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');


// set/ configure session
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: config.SESSION_SECRET,
  cookie: { maxAge: 60000 }
}));

// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req.session.userId = user.id;
  };

  // finds user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
});


//ROUTES
//serving index.html HomePage
app.get('/', function(req, res) {
  res.sendFile= __dirname + "/public/index.html";
});


// AUTH ROUTES (SIGN UP, LOG IN, LOG OUT)

// create new user with secure password
app.post('/users', function (req, res) {
  var newUser = req.body.user;
  User.createSecure(newUser, function (err, user) {
    // log in user immediately when created
    req.login(user);
    res.redirect('/');
  });
});

// authenticate user and set session
app.post('/login', function (req, res) {
  var userData = req.body.user;
  User.authenticate(userData.email, userData.password, function (err, user) {
    req.login(user);
    res.redirect('/');
  });
});

// log out user (destroy session)
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// API routes

// show current user
app.get('/api/users/current', function (req, res) {
  // check for current (logged-in) user
  req.currentUser(function (err, user) {
    res.json(user);
  });
});


//get all the bands from the db
app.get('/api/bands', function (req, res) {
  // find all foods in db
  Band.find(function (err, band) {
    res.json(band);
  });
});

//find one band with zipcode
app.get('/api/bands/:zipCode', function (req, res) {
  // set the value of the id
  var targetZip = req.params.zipCode;

  // find phrase in db by id
  Band.findOne({zipCode: targetZip}, function (err, foundBand) {
    res.json(foundBand);
  });
});


//post# create
app.post('/api/bands', function(req, res){
    //create newBand
    var newBand = new Band({
      name: req.body.name,
      genre: req.body.genre,
      zipCode: req.body.zipCode,
      about: req.body.about,
      picture: req.body.picture
      
    });
    //save to DB
    newBand.save(function (err, savedBand){
      res.json(savedBand);
    });
});

//put# update
app.put('/api/bands/:id', function (req, res){
  //set the value of the id
  var targetId = req.params.id;
  //find band by id in db
  Band.findOne({_id: targetId}, function (err, foundBand){
    foundBand.name = req.body.name;
    foundBand.genre = req.body.genre;
    foundBand.zipCode = req.body.zipCode;
    foundBand.about = req.body.about;
    foundBand.picture = req.body.picture;
    
    //save  updated band in db
    foundBand.save(function (err, savedBand){
      res.json(savedBand);
     });
  });
});

// // get's search results page.
// app.get('/search',function(req,res){
//   res.render('views/search') 
// });


//delete#remove
app.delete('/api/bands/:id', function (req, res){
  //set the value of the id
  var targetId = req.params.id;
  //find band in db and remove
  Band.findOneAndRemove({_id: targetId}, function (err, deletedBand){
    res.json(deletedBand);
  });
});

//connecting it to the server or port 3000
app.listen(config.PORT);
console.log('server started on locahost:3000');



