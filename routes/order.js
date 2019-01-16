var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;

var Product = require('../models/product');
var Category = require('../models/category');
var User = require('../models/user');
var Order = require('../models/order');
var Detail = require('../models/detail');
var Saldo = require('../models/saldo');

router.get('/add', function(req, res, next) {
  Product.find({}, function(err, docs) {
    //console.log(docs);
    res.render('order',{ title: 'Add Transaction', datas:docs });
    if(err) throw err;
  });
});

router.post('/add', function(req, res, next) {
  console.log(req.user.id);

  var orderid = uuidv1();
  var tgl_trx = Date();
  var total = req.body.total;
  var created = Date();
  var modified = Date();
  var userid = req.user.id;

  var produk_id = req.body.id;
  var name = req.body.name;
  var price = req.body.price;
  var qty = req.body.qty;

  //form validator
  req.checkBody('qty','Qty Field is Required').notEmpty();
  //check errors
  var errors = req.validationErrors();

  if(errors){
    res.render('order', {errors: errors }) ;
  }else{
    //add header
    var newOrder = new Order({
      user_id : userid,
      trx_date: tgl_trx,
      total : total,
      created : created,
      modified : modified,
      order_id : orderid
    });
    Order.createOrder(newOrder, function(err, order){
      if(err) throw err;
      console.log(Order);
      for ( var counter=0 ;counter<produk_id.length;counter++)
      {
        //add detail
        var newDetail = new Detail({
          order_id : orderid,
          produk_id: produk_id[counter],
          name : name[counter],
          price : price[counter],
          qty : qty[counter]
        });
        Detail.createDetail(newDetail, function(err, detail){
          if(err) throw err;
          console.log(Detail);

          //update saldo penjual
          Product.findOne({id: produk_id[counter]}, function (err, prd) {
              if(err) throw err;
              var penjual = prd.userid;
              var pembeli = userid;

              console.log(total);

              Saldo.findOne({userid: penjual}, function (err, pjl) {
                  if(err) throw err;
                  pjl.jumlah = pjl.jumlah + total;
                  console.log(pjl.jumlah);
                  Saldo.findOneAndUpdate(
                      {userid: pjl.userid},
                      {jumlah: pjl.jumlah},
                      function (err, pjl) {
                      });
              });

              Saldo.findOne({userid: pembeli}, function (err, pbl) {
                  if(err) throw err;
                  pbl.jumlah = pbl.jumlah - total;
                  console.log(pbl.jumlah);
                  Saldo.findOneAndUpdate(
                      {userid: pbl.userid},
                      {jumlah: pbl.jumlah},
                      function (err, pbl) {
                      });
              });
          });

        });
      }
    });
    req.flash('success', 'Transaction has been added');

    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
