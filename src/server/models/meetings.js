var mongoose = require('mongoose-q')(require('mongoose'));
var Schema = mongoose.Schema;

var Meeting = new Schema({
    name : String,
    day : String,
    time : String,
    street : String,
    area : String
});

module.exports = mongoose.model('meetings', Meeting);
