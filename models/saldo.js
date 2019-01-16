var mongoose = require('mongoose');
var bcrypt = require ('bcryptjs');

mongoose.connect('mongodb://localhost/tutorial');

var db = mongoose.connection;

var SaldoSchema= new mongoose.Schema({
    userid:{
        type: String,
        index: true
    },
    jumlah:{
        type: Number,
    },
    tgl_trx:{
        type: Date,
    }
});

var Saldo = module.exports = mongoose.model('Saldo',SaldoSchema);

module.exports.createSaldo = function(newSaldo, callback){
    newSaldo.save(callback);
}
