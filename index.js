const express = require('express');
const getRoute=require('./page.html');

const app = express();
const server = app.listen(3000, () => {
  console.log("server @", server.address().port);
});
app.use('/',getRoute);
