/*
Module to handle the login 'post' request. Validates the 'post' request, the
user from database and redirect the url to chat_room or revert back.
*/
const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');

const router = express.Router();

//MongoDB url
const dburl = 'mongodb://localhost:27017';

//data to be sent to the client regarding the status
const responseData = {
    "statusCode" : "0",
    "statusText" : "nothing"
};
const MongoClient=mongodb.MongoClient;

router.use(cookieParser());

//Cookie to be stored.
var cookieStored={
    "email":"",
    "session":false,
    "username":""
};

/*Handle the 'get' request over the page. Re-directing to 'message' or on the
same page via validation from cookies
*/
router.get('/', (request, response) => {
    cookieStored=request.cookies['chat_room_cookie'];
    if(cookieStored==undefined){
        response.sendFile(path.join(__dirname,'../public','login.html'));
    }
    else if(cookieStored.session==true){
        response.redirect('/message');
    }
    else{
        response.sendFile(path.join(__dirname,'../public','login.html'));
    }
});

//Handle the logout 'get' request and re-direct
router.get('/logout', (request, response) => {
    response.cookie("chat_room_cookie", "");
    response.redirect('/');
});

//Handle the 'post' request
router.post('/', (request, response) =>{
    //MongoClient connection
    MongoClient.connect(dburl,{useUnifiedTopology:true},{useNewUrlParser:true},function(err,client){
        if(err){
            responseData["statusCode"] = "503";
            responseData["statusText"] = "unable to connect server"
            response.send(responseData).end();
        }
        else{
            //Extracting data from the 'post' request
            var post_data=request.body;
            var password=post_data.password;
            var email=post_data.email;
            if(checkValidity(email,password)){
                // Database and Collection connection
                //query to find the user from database via 'email'
                client.db('chat_room').collection('users').find({email:email},{projection:{email:1,password:1,username:1}}).toArray(function(error,result){
                    if(error){
                        responseData["statusCode"] = "503";
                        responseData["statusText"] = "unable to connect database"
                        response.send(responseData).end();
                    }
                    else{
                        if(result.length==0){
                            responseData["statusCode"] = "401";
                            responseData["statusText"] = "error in credentials";
                            response.send(responseData).end();
                        }
						else if(result[0]['password']!=password){
                            responseData["statusCode"] = "401";
                            responseData["statusText"] = "error in credentials";
                            response.send(responseData).end();
                        }
						else{
                            responseData["statusCode"] = "200";
                            responseData["statusText"] = "Login success";
                            cookieStored = {
                                "email" : email,
                                "session" : true,
                                "username" : result[0]['username']
                            };
                            //cookie updated on successfull login
                            response.cookie("chat_room_cookie", cookieStored);
                            //response sent to the client
                            response.send(responseData).end();
                        }
                    }
                });
            }
            else{
                responseData["statusCode"] = "401";
                responseData["statusText"] = "error in credentials";
                response.send(responseData).end();
            }
        }
    });
});

function checkValidity(email,password){
    if(email===undefined||email===null||email==="null"||email.length<1){
        return false;
    }
    if(password===undefined||password===null||password==="null"||password.length<1){
        return false;
    }
	return true;
}

module.exports = router;
