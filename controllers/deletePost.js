const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const BlogPost = require("../models/BlogPost.js");
const User = require("../models/User");

module.exports = (req, res) => {

  if (req.session.userId == BlogPost.userid){
    BlogPost.deleteOne({userid: req.session.userId, _id: req.body.blogpost._id})
      .then((post) => {
        try{
          res.status = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(post);
        }
        catch (err) {
          res.status = 500;
          next(err);
        }
      });
    res.redirect("/");
  }
};
