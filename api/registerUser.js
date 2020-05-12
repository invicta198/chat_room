const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');

const router = express.Router();
const dburl = 'mongodb://localhost:27017';
const responseData = {
  "statusCode" : "0",
  "statusText" : "nothing"
};
const MongoClient=mongodb.MongoClient;

router.use(cookieParser());

const app=express();
var cookieStored="";

router.get('/', (request, response) => {
  cookieStored=""+request.cookies['email'];
  //console.log(cookieStored);
  if(cookieStored==undefined || cookieStored=="")
    response.sendFile(path.join(__dirname,'../public','register.html'));
  else response.redirect('/message');
});

router.post('/', (request, response) =>{
  MongoClient.connect(dburl,{useUnifiedTopology:true},{useNewUrlParser:true},function(err,client){
  if(err){
		responseData["statusCode"] = "503";
    responseData["statusText"] = "unable to connect server"
    response.send(responseData).end();
  }
  else{
    //console.log("inside else");
    var post_data=request.body;
		var password=post_data.password;
		var email=post_data.email;
		if(checkValidity(email,password)){
      client.db('chat_room').collection('users').find({email:email},{projection:{email:1,password:1}}).toArray(function(error,result){
          if(error){
            responseData["statusCode"] = "503";
            responseData["statusText"] = "unable to connect database"
            response.send(responseData).end();
          }
				  else{
            if(result.length==0){
              insertJson = {
                "email":email,
                "password":password
              };
              client.db('chat_room').collection('users').insertOne(insertJson,function(err,res){
                if(err){
                  responseData["statusCode"] = "200";
                  responseData["statusText"] = "Register unsuccess"
                  response.send(responseData).end();
                }
                else{
                  responseData["statusCode"] = "201";
                  responseData["statusText"] = "Register success";
                  response.cookie("email",email);
                  response.send(responseData).end();
                }
		    			});
            }
						else if(result[0]['password']!=password){
              responseData["statusCode"] = "401";
              responseData["statusText"] = "error in credentials"
              response.send(responseData).end();
            }
						else{
              responseData["statusCode"] = "200";
              responseData["statusText"] = "user already exists"
              response.send(responseData).end();
          }
				}
			});
		}
		else{
      responseData["statusCode"] = "401";
      responseData["statusText"] = "error in credentials"
      response.send(responseData).end();
		}
   }
  });
});

function checkValidity(email,password){
	if(email===undefined||email===null||email==="null"||email.length<1)	return false;
	if(password===undefined||password===null||password==="null"||password.length<1)	return false;
	return true;
}

module.exports = router;
