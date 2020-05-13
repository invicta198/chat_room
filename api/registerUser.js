/*
Module to handle the registration 'post' request. Validates the 'post' request, the
user from database and redirect the url to chat_room or revert back.
*/
const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');

const router = express.Router();
const dburl = 'mongodb://localhost:27017';

//object sent to client as response
const responseData = {
    "statusCode" : "0",
    "statusText" : "nothing"
};
const MongoClient=mongodb.MongoClient;
const app=express();

//cookie object which is to be stored
var cookieStored={
    "email":"",
    "session":false,
    "username":""
};

router.use(cookieParser());

//Handle 'get' request over the page
router.get('/', (request, response) => {
    cookieStored=request.cookies['chat_room_cookie'];
    console.log(cookieStored);
    if(cookieStored==undefined){
        response.sendFile(path.join(__dirname,'../public','register.html'));
    }
    else if(cookieStored.session==true){
        response.redirect('/message');
    }
    else{
        response.sendFile(path.join(__dirname,'../public','register.html'));
    }
});

//Handle the 'post' request over the page
router.post('/', (request, response) =>{
    //MongoClient connectino
    MongoClient.connect(dburl,{useUnifiedTopology:true},{useNewUrlParser:true},function(err,client){
        if(err){
            responseData["statusCode"] = "503";
            responseData["statusText"] = "unable to connect server";
            response.send(responseData).end();
        }
        else{
            //Extracting the values from the request
            var post_data=request.body;
            var password=post_data.password;
            var email=post_data.email;
            var username=post_data.username;
            if(checkValidity(email,password,username)){
                //Database connection
                client.db('chat_room').collection('users').find({email:email},{projection:{email:1,password:1}}).toArray(function(error,result){
                    if(error){
                        responseData["statusCode"] = "503";
                        responseData["statusText"] = "unable to connect database";
                        response.send(responseData).end();
                    }
                    else{
                        if(result.length==0){
                            //object to be stored into the database
                            insertJson = {
                                "email":email,
                                "password":password,
                                "username":username
                            };
                            //query to add the user
                            client.db('chat_room').collection('users').insertOne(insertJson,function(err,res){
                                if(err){
                                    responseData["statusCode"] = "200";
                                    responseData["statusText"] = "Register unsuccess";
                                    response.send(responseData).end();
                                }
                                else{
                                    responseData["statusCode"] = "201";
                                    responseData["statusText"] = "Register success";
                                    //cookie updated on successfull registration
                                    cookieStored = {
                                        "email" : email,
                                        "session" : true,
                                        "username" : username
                                    };
                                    //cookie sent
                                    response.cookie("chat_room_cookie", cookieStored);
                                    //response sent
                                    response.send(responseData).end();
                                }
                            });
                        }
                        else if(result[0]['password']!=password){
                            responseData["statusCode"] = "401";
                            responseData["statusText"] = "error in credentials";
                            response.send(responseData).end();
                        }
						else{
                            responseData["statusCode"] = "200";
                            responseData["statusText"] = "user already exists";
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

function checkValidity(email,password, username){
	if(email===undefined||email===null||email==="null"||email.length<1){
        return false;
    }
	if(password===undefined||password===null||password==="null"||password.length<1){
        return false;
    }
    if(username===undefined||username===null||username==="null"||username.length<1){
        return false;
    }
	return true;
}

module.exports = router;
