const express = require('express');
const mongodb = require('mongodb');
const path = require('path');

const app=express();
const router = express.Router();

router.post('/', (request, response) => {
  var message = "";
  var name = "";
  //console.log(request.body);
  var data = request.body;
  name = data.name;
  message = data.message;
  response.send(name+" : "+message);
});

module.exports=router;
