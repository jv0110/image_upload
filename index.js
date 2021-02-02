'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const routes = require('./src/routes/routes');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(routes);
// Here we define the tmp/uploads as a static folder and access its files
// through the /files/ route
app.use('/files', express.static(path.resolve(__dirname, 'tmp', 'uploads')))/

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server started :)');
});