const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.route('/')
  .post(userController.index)
userRouter.route('/register')
  .post(userController.signup)
userRouter.route('/edit/:userId')
  .get(userController.formEdit)
  .post(userController.edit)

module.exports = userRouter;