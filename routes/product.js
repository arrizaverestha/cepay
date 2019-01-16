var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;

var Product = require('../models/product');
var Category = require('../models/category');
var User = require('../models/user');

router.get('/add', function(req, res, next) {
  Category.find({}, function(err, docs) {
    //console.log(docs);
    res.render('product',{ title: 'Add Product', datas:docs });
    if(err) throw err;
  });
});

router.post('/add', function(req, res, next) {
  console.log(req);

  var name = req.body.name;
  var description = req.body.description;
  var categoryid = req.body.categoryid;
  var specific_price = req.body.specific_price;
  var normal_price = req.body.normal_price;
  var userid = req.user.id;

  //form validator
  req.checkBody('name','Name Field is Required').notEmpty();
  req.checkBody('description','Description Field is Required').notEmpty();
  req.checkBody('categoryid','CategoryId Field is Required').notEmpty();
  req.checkBody('specific_price','Specific Price Field is Required').notEmpty();
  req.checkBody('normal_price','Normal Price Field is Required').notEmpty();
  //check errors
  var errors = req.validationErrors();

  if(errors){
    res.render('product', {errors: errors }) ;
  }else{
    var newProduct = new Product({
      name : name,
      description: description,
      categoryid : categoryid,
      userid : userid,
      specific_price : specific_price,
      normal_price : normal_price
    });
    Product.createProduct(newProduct, function(err, product){
      if(err) throw err;
      console.log(Product);
    });

    req.flash('success', 'Product has been added');

    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
