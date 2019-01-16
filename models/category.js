var mongoose = require('mongoose');
var bcrypt = require ('bcryptjs');

mongoose.connect('mongodb://localhost/tutorial');

var db = mongoose.connection;

var CategorySchema= new mongoose.Schema({
    name:{
        type: String,
        index: true
    }
});

var Category = module.exports = mongoose.model('Category',CategorySchema);

module.exports.createCategory = function(newCategory, callback){
    newCategory.save(callback);
}
