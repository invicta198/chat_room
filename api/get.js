const express = require('express');
const mongodb = require('mongodb');
const path = require('path');

const app=express();
const router = express.Router();

router.get('/', (request, response) => {
  response.sendFile(path.join(__dirname,'../public','login.html'));
});

module.exports = router;