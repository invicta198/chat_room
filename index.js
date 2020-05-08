const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const mongodb = require('mongodb');

const getRoute=require('./api/get.js');
const loginRoute=require('./api/loginUser.js');
const registerRoute=require('./api/registerUser.js');
const messageRoute=require('./api/chat.js');

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

const http = require('http').Server(app);
const io = require('socket.io')(http);

const serverHTTP = http.listen(3000, () => {
  console.log('http @ 3000');
});

io.on('connection', ()=>{
  console.log('server connect');
});

io.on('disconnect', (socket)=>{
  console.log('server disconnect');
});

app.use('/',getRoute);
app.use('/message',messageRoute);
app.use('/register',registerRoute);
app.use('/login',loginRoute);

var options = {
  useNewUrlParser:true,
  useUnifiedTopology:true
}

mongoose.connect(dburl, options, function(error) {
  if(error)
    console.log(error);
});
