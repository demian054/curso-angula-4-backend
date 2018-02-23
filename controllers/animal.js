'use strict'
// modulos
var fs = require('fs');
var path = require('path');

// Modelos
var User = require('../models/user');
var Animal = require('../models/animal');

//servicios


// Acciones
function pruebas(req, res){S
  res.status(200).send({
    message: 'Probando el controlador animal',
    user: req.user
  });
}

module.exports = {
  pruebas
}
