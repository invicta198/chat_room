const express = require('express');
const mongodb = require('mongodb');
const path = require('path');

const app=express();
const router = express.Router();

router.get('/', (request, response) => {
  response.sendFile(path.join(__dirname,'../public','login.html'));
});

router.get('/login', (request, response) => {
  response.sendFile(path.join(__dirname,'../public','login.html'));
});

router.get('/register', (request, response) => {
  response.sendFile(path.join(__dirname,'../public','register.html'));
});

router.get('/message', (request, response) =>{

});
module.exports=router;
