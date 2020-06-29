const express = require('express');
const bodyParser = require('body-parser');

const app = express();


app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));


const Router = require('./router/foodRouter');
app.use(Router);

module.exports = app;