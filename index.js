const express = require('express');
const parser = require('body-parser');

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


var onlineSockets = {};

io.on('connection', (socket)=>{
    console.log('server connect');

    socket.on('message', (data) =>{
        io.emit('message', '<strong>' + socket.username + '</strong>: ' + data);
    });

    socket.on('username', (data) =>{
        socket.username = data;
        onlineSockets[""+socket.id] = data;
        io.emit('online socket', onlineSockets);
    });

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
