var express = require('express');
var router = express.Router();

var Saldo = require('../models/saldo');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    Saldo.findOne({userid: req.user.id}, function (err, docs) {
      console.log(docs);
      res.render('index',{ title: 'Members Area', datas:docs });
      if(err) throw err;
    });
  } else {
    res.render('index', { title: 'Members Area' });
  }

});

module.exports = router;
