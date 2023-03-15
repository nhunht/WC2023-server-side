const express = require('express');
const playerController = require('../controllers/playerController')
const playersRouter = express.Router();

playersRouter.route('/')
    .get(playerController.index)
    .post(playerController.create);
playersRouter.route('/edit/:playerId')
    .get(playerController.formEdit)
    .post(playerController.edit);
playersRouter.route('/delete/:playerId') 
    .get(playerController.delete)
    
module.exports = playersRouter;
