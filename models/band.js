//require mongoose
var mongoose = require('mongoose'),
//creating db model Schema
Schema = mongoose.Schema;

var bandSchema = new Schema({
  bandName: { type:String, required: true },
  genre: { type:String, required: true },
  zipCode: { type:Number, required: true },
  picture: { type:String, required: true },
  about: { type:String, required: true },
});

//saving the Schema to var Band and exporting
var Band = mongoose.model('Band', bandSchema);
module.exports = Band;
