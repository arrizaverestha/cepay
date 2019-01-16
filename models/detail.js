var mongoose = require('mongoose');
var bcrypt = require ('bcryptjs');

mongoose.connect('mongodb://localhost/tutorial');

var db = mongoose.connection;

var DetailSchema= new mongoose.Schema({
    order_id:{
        type: String,
    },
    produk_id:{
        type: String,
    },
    name:{
      type: String,
    },
    price:{
      Type: Number,
    },
    qty:{
        type: Number,
    }
});

var Detail = module.exports = mongoose.model('Detail',DetailSchema);

module.exports.createDetail = function(newDetail, callback){
    newDetail.save(callback);
}
