const express = require('express');
const mongodb = require('mongodb');
const path = require('path');

const app=express();
const router = express.Router();

router.get('/', (request, response) => {
  console.log("chat.js : ",request.body);
  response.sendFile(path.join(__dirname,'../public','chat.html'));
});

module.exports = router;
