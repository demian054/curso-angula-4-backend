'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo')
    .then(() =>{
      console.log('Conexion exitosa a mongo db');
      app.listen(port, () => {
        console.log("servidor local activo");
      });
    })
    .catch(err => console.log(err));
