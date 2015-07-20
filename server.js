//requiring modules
var express = require('express'),
    app = express(),
    _ = require('underscore'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/bands');
var Band = require('./models/band');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

//serving index.html
app.get('/', function(req, res) {
  var index = __dirname + "/index.html";
  res.sendFile(index);
});

app.get('/api/bands', function (req, res) {
  // find all foods in db
  Band.find(function (err, bands) {
    console.log("--> these are the bands:");
    console.log(bands);
    res.json(bands);
  });
});

//post# create
app.post('/api/bands', function(req, res){
    var newBand = new Band({
      bandName: req.body.bandName,
      genre: req.body.genre,
      zipCode: req.body.zipCode,
      picture: req.body.picture,
      about: req.body.about
    });
    // res.json(newBand);
    //save to DB
    newBand.save(function (err, savedBand){
      res.json(savedBand);
    });
});

//put# update
app.put('/api/bands/:id', function (req, res){
  var targetId = req.params.id;
  //find band by id in db
  Band.findOne({_id: targetId}, function (err, foundBand){
    foundBand.bandName = req.body.bandName;
    foundBand.genre = req.body.genre;
    foundBand.zipCode = req.body.zipCode;
    foundBand.picture = req.body.picture;
    foundBand.about = req.body.about;
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









app.listen(process.env.PORT || 3000);
console.log('server started on locahost:3000');



