var mongoose = require('mongoose');
var bcrypt = require ('bcryptjs');

mongoose.connect('mongodb://localhost/tutorial');

var db = mongoose.connection;

var GroupSchema= new mongoose.Schema({
    title:{
        type: String,
        index: true
    }
});

var Group = module.exports = mongoose.model('Group',GroupSchema);

module.exports.createGroup = function(newGroup, callback){
    newGroup.save(callback);
}
