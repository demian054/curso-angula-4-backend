'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal');

var api = express.Router();
var mdAuth = require('../middlewares/authenticate');
var mdAdmni = require('../middlewares/is_admin');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals'});

api.get('/pruebas-animal', mdAuth.ensureAuth, AnimalController.pruebas);
api.post('/animal', [mdAuth.ensureAuth, mdAdmni.isAdmin], AnimalController.saveAnimal);
api.post('/update-image-animal/:id', [mdAuth.ensureAuth, mdAdmni.isAdmin, md_upload], AnimalController.uploadImage);
api.get('/get-image-animal/:imageFile', AnimalController.getImageFile);

api.get('/animals', AnimalController.getAnimals);
api.get('/animal/:id', AnimalController.getAnimal);
api.put('/animal/:id', [mdAuth.ensureAuth, mdAdmni.isAdmin], AnimalController.updateAnimal);
api.delete('/animal/:id', [mdAuth.ensureAuth, mdAdmni.isAdmin], AnimalController.deleteAnimal);

module.exports = api;
