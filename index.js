const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const mongodb = require('mongodb');

const getRoute=require('./api/get.js');
const loginRoute=require('./api/loginUser.js');
const registerRoute=require('./api/registerUser.js');
const postRoute=require('./api/post.js');

const app = express();
const dburl = 'mongodb://localhost:27017';
const message = mongoose.model(
  "Message",
  {
    name:String,
    message:String
  });

app.use(parser.json());
app.use(parser.urlencoded({extended:true}));

const server = app.listen(3000, () => {
  console.log("server @", server.address().port);
});

app.get('/',getRoute);
app.use('/register',registerRoute);
app.use('/login',loginRoute);

app.post('/',postRoute);

var options = {
  useNewUrlParser:true,
  useUnifiedTopology:true
}
mongoose.connect(dburl, options, function(error) {
  if(error)
    console.log(error);
});
