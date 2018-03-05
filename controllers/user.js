'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs')
var fs = require('fs');
var path = require('path');

// Modelos
var User = require('../models/user');

//servicios
var jwt = require('../services/jwt');


// Acciones
function login(req, res){
  var params = req.body;
  console.log(params);
  var email = params.email;
  var password = params.password;
  if (!email || !password) {
    res.status(500).send({ message: 'Datos Insuficientes'});
  } else {
    User.findOne({email: params.email.toLowerCase()}, (err, issetUser) => {
      if (err) {
        res.status(500).send({ message: 'Error'});
      } else {
        if (!issetUser) {
          res.status(404).send({ message: 'Error, El usuario no existe'});
        } else {
          bcrypt.compare(password, issetUser.password, (err, check) => {
            if (check) {
              if (params.gettoken) {
                  res.status(200).send({
                    token: jwt.createToken(issetUser)
                  });
              } else {
                res.status(200).send({ message: 'Login Correcto', user: issetUser });
              }
            } else {
              res.status(404).send({ message: 'Login Incorrecto'});
            }
          });
        }
      }
    });
  }
}

function pruebas(req, res){
  res.status(200).send({
    message: 'Probando el controlador usuario',
    user: req.user
  });
}

function getKeepers(req, res){
  User.find({role:'ROLE_ADMIN'}).exec((err, users) => {
    if (err) {
      res.status(500).send({message: 'error en la peticion'});
    } else {
      if (!users) {
        res.status(404).send({message: 'no hay'});
      } else {
        res.status(200).send({users});
      }
    }
  });
}

function getImageFile(req, res){
  console.log(req.params.imageFile);
  var imageFile = req.params.imageFile;
  var file_path = './uploads/users/'+imageFile;

  fs.exists(file_path, function(exists) {
    if (exists) {
      res.sendFile(path.resolve(file_path));
    } else {
      res.status(404).send({message: 'NO existe'});
    }
  });
}

function uploadImage(req, res){
  var userId = req.params.id;
  var file_name = 'No subido...';

  if (req.files) {
    console.log(req.files.image.path);
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    var ext_split = file_name.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'git') {
      if (userId != req.user.sub) {
        return res.status(500).send({message: 'No tienes permisoss'});
      }
      console.log('aqui');
      User.findByIdAndUpdate(userId, { image: file_name}, {new :true}, (err, userUpdated) => {
        if (err) {
          res.status(500).send({message: 'error al actualizar'});
        } else {
          if (!userUpdated) {
            res.status(404).send({message: 'error actualizando'});
          } else {
            res.status(200).send({
              file_path: file_path,
              file_split: file_split,
              file_name: file_name,
              user: userUpdated
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

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;
  delete update.password;
  if (userId != req.user.sub) {
    return res.status(500).send({message: 'No tienes permisoss'});
  }
  console.log(update);
  User.findByIdAndUpdate(userId, update, {new :true}, (err, userUpdated) => {
    if (err) {
      return res.status(500).send({message: 'error al actualizar'});
    } else {
      if (!userUpdated) {
        return res.status(404).send({message: 'error actualizando'});
      } else {
        return res.status(200).send({message: 'Actualizado', user: userUpdated});
      }
    }
  });
}



function saveUser(req, res){
  var user = new User();

  var params = req.body;

  console.log(params);

  if (params.password && params.name && params.surname && params.email){

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;

    user.role = 'ROLE_USER';
    user.imagen = null;

    User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
      if (err) {
        res.status(500).send({ message: 'Error, No se regsitro el usuario'});
      } else {
        if (issetUser) {
          res.status(500).send({ message: 'Error, El usuario ya existe'});
        } else {
          bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            user.save((err, userStored) => {
              if(err){
                //console.log(err);
                res.status(500).send({ message: 'Error, No se regsitro el usuario'});
              } else {
                if (!userStored) {
                  console.log("no se registro");
                  res.status(404).send({ message: 'No se regsitro el usuario'});
                } else {
                  console.log("si se registro");
                  res.status(200).send({ message: 'Regsitro Correcto', user: userStored });
                }
              }
            });
          });
        }
      }
    });

  } else {
    res.status(200).send({ message: 'No se regsitro el usuario, faltan datos'});
  }
}

module.exports = {
  pruebas,
  saveUser,
  login,
  updateUser,
  uploadImage,
  getImageFile,
  getKeepers
}
