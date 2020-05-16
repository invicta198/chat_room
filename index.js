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

io.on('connection', (socket)=>{
    console.log('server connect');

    //socket listen to 'message'
    socket.on('message', (data) =>{
        const new_data = {
            "data" : data,
            "sender" : socket.username
        };
        io.emit('message',new_data);
    });

    //socket listen to 'username'
    socket.on('username', (data) =>{
        socket.username = data;
        onlineSockets[""+socket.id] = data;
        console.log(socket.username," : ",socket.id);
        io.emit('online socket', onlineSockets);
    });

    //on socket disconnect
    socket.on('disconnect', ()=>{
        delete onlineSockets[""+socket.id];
        console.log("disconnect : ",socket.id);
        io.emit('online socket', onlineSockets);
    });

});

app.use('/',getRoute);
app.use('/message',messageRoute);
app.use('/register',registerRoute);
app.use('/login',loginRoute);
