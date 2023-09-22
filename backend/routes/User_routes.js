const UserControl = require('../controllers/User_controllers')
const Router = require('express').Router()

Router.post('/signIn',UserControl.signupUser)
Router.post('/logIn',UserControl.loginUser)

module.exports = Router
