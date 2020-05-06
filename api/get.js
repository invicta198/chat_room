const express = require('express');
const mongodb = require('mongodb');
const path = require('path');

const app=express();
const router = express.Router();

router.get('/', (request, response) => {
  console.log("yes");
  response.sendFile(path.join(__dirname,'../public','page.html'));
});

router.get('/message', (request, response) =>{

});
module.exports=router;
