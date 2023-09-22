const sellerControl = require('../controllers/seller_controllers')
const Router = require('express').Router()


Router.post('/signIn',sellerControl.signupSeller)
Router.post('/logIn/',sellerControl.loginSeller)


module.exports = Router