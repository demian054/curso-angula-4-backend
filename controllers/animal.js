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

function deleteAnimal(req, res){
  var animalId = req.params.id;
  Animal.findByIdAndRemove(animalId, (err, animalRempoved) => {
    if (err) {
      res.status(500).send({message: 'Error al borrar'});
    } else {
      if (!animalRempoved) {
        res.status(404).send({message: 'NO existe'});
      } else {
        res.status(200).send({
          message: 'borrado',
          animal: animalRempoved
        });
      }
    }
  });
}


function getImageFile(req, res){
  console.log(req.params.imageFile);
  var imageFile = req.params.imageFile;
  var file_path = './uploads/animals/'+imageFile;

  fs.exists(file_path, function(exists) {
    if (exists) {
      res.sendFile(path.resolve(file_path));
    } else {
      res.status(404).send({message: 'NO existe'});
    }
  });
}

function uploadImage(req, res){
  var animalId = req.params.id;
  var file_name = 'No subido...';
  console.log(req);
  if (req.files) {
    console.log(req.files.image.path);
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    var ext_split = file_name.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'git') {

      console.log('aqui');
      Animal.findByIdAndUpdate(animalId, { image: file_name}, {new :true}, (err, animalUpdated) => {
        if (err) {
          res.status(500).send({message: 'error al actualizar'});
        } else {
          if (!animalUpdated) {
            res.status(404).send({message: 'error actualizando'});
          } else {
            res.status(200).send({
              file_path: file_path,
              file_split: file_split,
              file_name: file_name,
              animal: animalUpdated
            });
          }
        }
      });
    } else {
      fs.unlink(file_path, (err) => {
        if (err) {
          console.log(err);
          return res.status(200).send({message: 'Extencion invalida y no borrado'});
        } else {
          return res.status(200).send({message: 'Extencion invalida'});
        }
      });
    }
  } else {
    res.status(200).send({
      message: 'No hay fichers',
      user: req.user,
      req:req.params
    });
  }
}

module.exports = {
  pruebas,
  saveAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  uploadImage,
  getImageFile,
  deleteAnimal
}
