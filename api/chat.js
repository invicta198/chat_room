const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');

const app=express();
const router = express.Router();

router.use(cookieParser());

var cookieStored={
    "email":"",
    "session":false,
    "username":""
};

router.get('/', (request, response) => {
    cookieStored=request.cookies['chat_room_cookie'];
    console.log(cookieStored);
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
