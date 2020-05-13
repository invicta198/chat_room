/*
Module for handeling the 'get' request on the home page.
*/
const express = require('express');
const mongodb = require('mongodb');
const path = require('path');

const app=express();
const router = express.Router();

//handle 'get' request
router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname,'../public','intro.html'));
});

module.exports = router;
