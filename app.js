const http = require('http');
const express = require('express');
const app = express();
const basicRoutes = require('./routes/basic');

app.use(express.json());
app.use('/hospitals', basicRoutes);

const PORT = 3000;

app.listen(3000,()=>{
  console.log('server is listening on port 3000');
})