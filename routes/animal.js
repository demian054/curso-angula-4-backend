'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal');

var api = express.Router();
var mdAuth = require('../middlewares/authenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals'});

api.get('/pruebas-animal', mdAuth.ensureAuth, AnimalController.pruebas);
api.post('/animal', mdAuth.ensureAuth, AnimalController.saveAnimal);
/*api.post('/login', UserController.login);
api.put('/update-user/:id', mdAuth.ensureAuth, AnimalController.updateUser);
api.post('/update-image-user/:id', [mdAuth.ensureAuth, md_upload], AnimalController.uploadImage);
api.get('/get-image-file/:imageFile', AnimalController.getImageFile);/*/
api.get('/animals', AnimalController.getAnimals);
api.get('/animal/:id', AnimalController.getAnimal);
api.put('/animal/:id', mdAuth.ensureAuth, AnimalController.updateAnimal);

module.exports = api;
