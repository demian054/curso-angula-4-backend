'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');


//middlewares de bodyParser
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());


// configurar cabeceras y cors
app.use('/api', user_routes);
app.use('/api', animal_routes);

// rutas body-parser
app.get('/probando', (req, res) => {
  res.status(200).send({message: 'este es el metodo probando'});
});
module.exports = app;
