var userController = {};
var bcrypt = require('bcryptjs');
var path = require('path');
var User = require('./userModel');
var SessionCtrl = require('./sessionController')
var mongoose = require('mongoose');


userController.createUser = function(req, res) {
    User.create(req.body, function(err, data) {
      if (err) {
        // throw err
        console.log(err)
        return res.status(500).send('showAlert');
      }
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(data.password, salt);
      data.password = hash;
      res.cookie('SSID', data.id);
      console.log('id: ', data.id)
      SessionCtrl.startSession(req, res, data._id);
      data.save();
      res.redirect('/splash?id=' + data.id);
    });
};

userController.verify = function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, doc) {
    if (doc) {
      if (bcrypt.compareSync(req.body.password, doc.password)) {
        res.cookie('SSID', doc.id);
        SessionCtrl.startSession(req, res, doc._id);
        return res.redirect('/splash?id=' + doc.id)
      }
      // console.log('bye')
      return res.send('error: ', err);
    }
    userController.createUser(req,res);

  });

};


module.exports = userController
