//requiring modules
var express = require('express'),
    app = express(),
    _ = require('underscore'),
    cors = require('cors'),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    // config = require('./config'),
    session = require('express-session');

//connecting to mongoDB of heroku or localhost
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || require('./config').MONGO_URI);

//setting up models
var User = require('./models/user');
var Band = require('./models/band');


//serving index.html HomePage
app.get('/', function(req, res) {
  // console.log('hello')
  res.sendFile(__dirname + "/public/index.html");
});

//serving user.html UserPage
app.get('/user', function(req, res) {
  // console.log('hello')
  res.sendFile(__dirname + "/public/views/user.html");
});

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
  secret: process.env.SESSION_SECRET || require('./config').SESSION_SECRET,   
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

app.all('/*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


// AUTH ROUTES (SIGN UP, LOG IN, LOG OUT)

//route to get user

// create new user with secure password
app.post('/signup', function (req, res) {

   var newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
   });
   User.createSecure(newUser, function (err, user) {
     // log in user immediately when created
      req.login(user);
      console.log(user);
      res.send(user);
    // log in user immediately when created
  });
});


//find user by id
app.get('/api/current', function (req, res) {
  User.findById(req.session.userId).exec(function(err, user) {
    res.json(user);
  });
});


// authenticate user and set session
app.post('/login', function (req, res) {
  var userData = {
              email: req.body.email,
              password: req.body.password
            };
  User.authenticate(userData.email, userData.password, function (err, user) {
    if(user){
      req.login(user);
      res.json(user);
    }else {
      res.send(err);
      console.log(err);
    }
    console.log("hello " + userData.email);
  });
});


//show user view
app.get("/me", function (req, res) {
    //find user currently logged in
    req.currentUser(function (err, user) {
        console.log(req.currentUser);
        res.json(user);
    });
});


// log out user (destroy session)
app.get("/logout", function (req, res) {
  console.log("logging out " + req.session.userId);
  req.logout();
  res.redirect("/");
});



/////////// APIs for bands routes///////////////////

//get all the bands from the db
app.get('/api/bands', function (req, res) {
  Band.find(function (err, band) {
    res.json(band);
  });
})


//serach bands with zipcode
app.get('/api/bands/:zipcode', function (req, res) {
  // find all foods in db
  var targetZip = req.params.zipcode;
  // if (targetZip) {
    // console.log(targetZip);

    // find band in db by zip
    Band.find({zipCode: targetZip}, function (err, foundBand) {
      res.json(foundBand);
      console.log(foundBand);
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
app.listen(process.env.PORT || require('./config').PORT, function(){
  console.log('server started on locahost:3000');
});


