var mongoose = require('mongoose');
var bcrypt = require ('bcryptjs');

mongoose.connect('mongodb://localhost/tutorial');

var db = mongoose.connection;

var ProductSchema= new mongoose.Schema({
    name:{
        type: String,
        index: true
    },
    description:{
        type: String,
    },
    categoryid:{
        type: String,
    },
    userid:{
      type: String,
    },
    specific_price:{
      type: Number,
    },
    normal_price:{
      type: Number,
    }
});

var Product = module.exports = mongoose.model('Product',ProductSchema);

module.exports.createProduct = function(newProduct, callback){
    newProduct.save(callback);
}
