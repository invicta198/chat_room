const express = require('express');
const mongodb = require('mongodb');
const path = require('path');

const app=express();
const router = express.Router();

router.get('/', (request, response) => {
  response.sendFile(path.join(__dirname,'../public','register.html'));
});

router.post('/', (request, response) => {
  console.log("request : ",request.body);
  response.send(true);
});

module.exports = router;
