var mongoose = require('mongoose');
var bcrypt = require ('bcryptjs');

mongoose.connect('mongodb://localhost/tutorial');

var db = mongoose.connection;

var OrderSchema= new mongoose.Schema({
    user_id:{
        type: String,
    },
    trx_date:{
        type: Date,
    },
    total:{
        type: Number,
    },
    created:{
      type: Date,
    },
    modified:{
      type: Date,
    },
    order_id:{
      type: String,
    }
});

var Order = module.exports = mongoose.model('Order',OrderSchema);

module.exports.createOrder = function(newOrder, callback){
    newOrder.save(callback);
}
