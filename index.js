/*
Main module to handle the routes and message. Entry point for the npm.
*/
const express = require('express');
const parser = require('body-parser');

//routes defining the path
const getRoute=require('./api/get.js');
const loginRoute=require('./api/loginUser.js');
const registerRoute=require('./api/registerUser.js');
const messageRoute=require('./api/chat.js');

const app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended:true}));

const http = require('http').Server(app);
const io = require('socket.io')(http);

const serverHTTP = http.listen(3000, () => {
    console.log('http @ 3000');
});

//dictionary to store the socket.id : username
var onlineSockets = {};
//dictionary to store the username : socket.id
var onlineSockets_reverse = {};

io.on('connection', (socket)=>{
    
    socket.on('message', (data) =>{
        const new_data = {
            "data" : data["message"],
            "recipient" : data["recipient"],
            "sender" : socket.username
        };
        //console.log("message");
        io.to(onlineSockets_reverse[new_data["recipient"]]).emit('message',new_data);
    });

    //socket listen to 'username'
    socket.on('username', (data) =>{
        socket.username = data;
        onlineSockets[""+socket.id] = data;
        onlineSockets_reverse[""+data] = ""+socket.id;
        io.emit('online socket', onlineSockets);
    });

    //on socket disconnect
    socket.on('disconnect', ()=>{
        delete onlineSockets_reverse[onlineSockets[""+socket.id]];
        delete onlineSockets[""+socket.id];
        console.log('server disconnect');
        console.log(onlineSockets);
        console.log("#####");
        console.log(onlineSockets_reverse);
        console.log("*****************************");
        //console.log("disconnect : ",socket.id);
        io.emit('online socket', onlineSockets);
    });

});

app.use('/',getRoute);
app.use('/message',messageRoute);
app.use('/register',registerRoute);
app.use('/login',loginRoute);
