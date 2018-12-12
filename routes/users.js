var express = require('express');
var router = express.Router();
var multer = require ('multer');
var upload = multer ({dest:'./uploads'});
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;


var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
 
router.get('/register', function(req, res, next) {
  res.render('register',{ title: 'Register' });
});
 
router.get('/login', function(req, res, next) {
  res.render('login',{ title: 'Login' });
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login',filureFlash:'Invalid Username or Password '}),  
  function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
});   

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById (id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false,{message:'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err,isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      }else{
        return done(null, false,{message:'Invalid Password'})
      }
    });
  });
}));

var cpUpload = upload.single('profileimage');
 
router.post('/register', cpUpload, function(req, res, next) {
 
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
 
  if(req.file){
    console.log('uploading file');
    var profileimage = req.file.filename;
  }else{
    console.log('no upload file');
    var profileimage = 'noimage.jpg';
  }
 
  //form validator
  req.checkBody('name','Name Field is Required').notEmpty();
  req.checkBody('email','Email Field is Required').notEmpty();
  req.checkBody('email','Email is invalid').isEmail();
  req.checkBody('username','UserName Field is Required').notEmpty();
  req.checkBody('password','Password Field is Required').notEmpty();
  req.checkBody('password2','password do not match').equals(password);
 
  //check errors
  var errors = req.validationErrors();
 
  if(errors){
    res.render('register', {errors: errors }) ;
  }else{
    var newUser = new User({
      name : name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    });
    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success', 'You are now registeresd and can login');

    res.location('/');
    res.redirect('/');
  }
});
 
 
module.exports = router;