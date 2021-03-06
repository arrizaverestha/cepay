var express = require('express');
var router = express.Router();
var multer = require ('multer');
var upload = multer ({dest:'./uploads'});
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;

var User = require('../models/user');
var Group = require('../models/group');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  Group.find({}, function(err, docs) {
    console.log(docs);
    res.render('register',{ title: 'Register', datas:docs });
    if(err) throw err;
  });
});

router.get('/login', function(req, res, next) {
  //res.writeHead(200, {'Service-Worker-Allowed':'/', 'Content-Type':'application/javascript'});
  //res.sendFile("../loader.js");
  //response.writeHead(200, {'Content-Type':'text/javascript'});
  res.render('login',{ title: 'Login' });
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login',filureFlash:'Invalid Username or Password '}),
  function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
    Group.findOne({_id: req.user.groupid}, function(err, results) {
      //console.log(results);
      req.session.user = results;
      //console.log(req.session.user.title);
      if(err) throw err;
    });
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
  var groupid = req.body.groupid;

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
  req.checkBody('groupid','Group not selected').notEmpty();
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
      profileimage: profileimage,
      groupid: groupid
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

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success','You are now logged out');
  res.redirect('/users/login');
});


module.exports = router;
