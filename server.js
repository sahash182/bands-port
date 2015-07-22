//requiring modules
var express = require('express'),
    app = express(),
    _ = require('underscore'),
    cors = require('cors'),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    // User = require('./models/user'),
  session = require('express-session');

//connecting to mongoDB of heroku or localhost
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL 
  || 'mongodb://localhost/bands');


//setting up models
var User = require('./models/user');
var Band = require('./models/band');


//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


// setting view engine to render html files
// app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');


// set session options
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000 }
}));

//static Routes
app.use(express.static(__dirname + '/public'));


//ROUTES

//signup routes
app.get('/signup', function (req, res){
  res.send('coming');
});

//serving index.html
app.get('/', function(req, res) {
  res.sendFile= __dirname + "/public/index.html";
});

//serving search.html
app.get('/', function(req, res) {
  res.sendFile= __dirname + "/public/views/search.html";
});

//get all the bands from the db
app.get('/api/bands', function (req, res) {
  // find all foods in db
  Band.find(function (err, band) {
    res.json(band);
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

// get's search results page.
app.get('/search',function(req,res){
  res.render('views/search') 
  
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
app.listen(process.env.PORT || 3000);
console.log('server started on locahost:3000');



