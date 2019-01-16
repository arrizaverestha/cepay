var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;

var Saldo = require('../models/saldo');

router.get('/add', function(req, res, next) {
  res.render('saldo',{ title: 'Add Saldo' });
});

router.post('/add', function(req, res, next) {
  console.log(req)

  var jml = req.body.jml;
  var tgl = Date();
  var userid = req.user.id;

  //form validator
  req.checkBody('jml','Jumlah Field is Required').notEmpty();
  //check errors
  var errors = req.validationErrors();

  if(errors){
    res.render('saldo', {errors: errors }) ;
  }else{
    var newSaldo = new Saldo({
      userid : userid,
      jumlah : jml,
      tgl_trx : tgl
    });
    Saldo.createSaldo(newSaldo, function(err, saldo){
      if(err) throw err;
      console.log(saldo);
    });

    req.flash('success', 'Saldo has been added');

    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
