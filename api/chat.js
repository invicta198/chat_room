/*
Module for chat_room. This module handles 'get' request on the page. It either
redirects the url to 'login' or 'register' page Or reflect the 'chat' page.
*/

const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');

const app=express();
const router = express.Router();

router.use(cookieParser());

//cookie object which will be used for validation
var cookieStored={
    "email":"",
    "session":false,
    "username":""
};

//handles the get request over the page
router.get('/', (request, response) => {
    cookieStored=request.cookies['chat_room_cookie'];
    if(cookieStored==undefined){
        response.redirect('/login');
    }
    else if(cookieStored.session==true){
        response.sendFile(path.join(__dirname,'../public','chat.html'));
    }
    else{
        response.redirect('/login');
    }
});

router.post('/', (request, response) => {
    console.log("inside post");
});

module.exports = router;
