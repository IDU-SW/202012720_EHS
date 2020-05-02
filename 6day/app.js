const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

const foodRouter = require('./router/foodRouter');
app.use(foodRouter);

module.exports = app;