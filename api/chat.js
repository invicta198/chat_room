const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const mongoose = require('mongoose');

const app=express();
const router = express.Router();

router.get('/', (request, response) => {
  response.sendFile(path.join(__dirname,'../public','chat.html'));
});

router.post('/', (request, response) => {
  console.log("inside post");
});

module.exports = router;
