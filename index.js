const express = require('express');

const app = express();
const server = app.listen(3000, () => {
  console.log("server @", server.address().port);
});
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/page.html');
});
