const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

const foodRouter = require('./router/foodRouter');
app.use(foodRouter);
app.use(express.static("uploads"));

module.exports = app;