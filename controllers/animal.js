'use strict'
// modulos
var fs = require('fs');
var path = require('path');

// Modelos
var User = require('../models/user');
var Animal = require('../models/animal');

//servicios


// Acciones
function pruebas(req, res){
  res.status(200).send({
    message: 'Probando el controlador animal',
    user: req.user
  });
}

function updateAnimal(req, res){
  var animalId = req.params.id;
  var update = req.body;

  Animal.findByIdAndUpdate(animalId, update, {new :true},  (err, animalUpdated) => {
    if (err) {
        res.status(500).send({message: 'error al actualizar'});
    } else {
      if (!animalUpdated) {
          res.status(404).send({message: 'no existe para actualiazr'});
      } else {
        res.status(200).send({
          message: 'El animal actualizado',
          animal: animalUpdated
        });
      }
    }
  });
}


function getAnimal(req, res){
  var animalId = req.params.id;
  Animal.findById(animalId).populate({path: 'user'}).exec((err, animal) => {
    if (err) {
        res.status(500).send({message: 'error el get Animal'});
    } else {
      if (!animal) {
          res.status(404).send({message: 'no existe'});
      } else {
        res.status(200).send({
          message: 'El animal',
          animal: animal
        });
      }
    }
  });
}

function getAnimals(req, res){
  Animal.find({}).populate({path: 'user'}).exec((err, animals) => {
    if (err) {
        res.status(500).send({message: 'error el get Animal'});
    } else {
      if (!animals) {
          res.status(404).send({message: 'nok hay animales'});
      } else {
        res.status(200).send({
          message: 'Lista de animal',
          animals: animals
        });
      }
    }

  });



}


function saveAnimal(req, res){
  var animal = new Animal();
  var params = req.body;

  if (params.name) {
    animal.name = params.name;
    animal.description = params.description;
    animal.year = params.year;
    animal.image = params.image;
    animal.user = req.user.sub;

    animal.save((err, animalStored) => {
      if (err) {
        res.status(500).send({message: 'error el save Animal'});
      } else {
        if (!animalStored) {
          res.status(404).send({message: 'error al guardar save Animal'});
        } else {
          res.status(200).send({
            message: 'Guardado',
            animal: animalStored
          });
        }
      }
    });
  } else {
      res.status(404).send({message: 'PArametros faltantes'});
  }
}

module.exports = {
  pruebas,
  saveAnimal,
  getAnimals,
  getAnimal,
  updateAnimal
}
