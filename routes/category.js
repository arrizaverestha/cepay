var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;

var Category = require('../models/category');

router.get('/add', function(req, res, next) {
  res.render('category',{ title: 'Add Category' });
});

router.post('/add', function(req, res, next) {
  console.log(req);

  var name = req.body.name;

  //form validator
  req.checkBody('name','Name Field is Required').notEmpty();
  //check errors
  var errors = req.validationErrors();

  if(errors){
    res.render('category', {errors: errors }) ;
  }else{
    var newCategory = new Category({
      name : name
    });
    Category.createCategory(newCategory, function(err, category){
      if(err) throw err;
      console.log(category);
    });

    req.flash('success', 'Category has been added');

    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
