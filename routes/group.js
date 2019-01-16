var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;

var Group = require('../models/group');

router.get('/add', function(req, res, next) {
  //jalankan ini 3 kali yang pertama title User, terus kedua dan ketiga, titlenya diganti Super Admin sama Sales
  var newGroup = new Group({
    title : 'User'
  });
  Group.create(newGroup, function(err, group){
    console.log('group berhasil di tambah');
    if(err) throw err;
    console.log(group);
    res.redirect('/');
  });
});

module.exports = router;
