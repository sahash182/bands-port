var mongoose = require('mongoose'),

Schema = mongoose.Schema;

var bandSchema = new Schema({
  bandName: { type:String, required: true },
  genre: { type:String, required: true },
  zipCode: { type:Number, required: true },
  picture: { type:String, required: true },
  about: { type:String, required: true },
});

var Band = mongoose.model('Band', bandSchema);
module.exports = Band;
