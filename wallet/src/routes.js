const express = require('express')
const routes = express.Router()

const UsersController = require('./controllers/UsersController')
const WalletController = require('./controllers/WalletController')

routes.post('/users', UsersController.create)
routes.post('/getToken', UsersController.getToken)

routes.get('/wallet', WalletController.hashes)
routes.post('/wallet', WalletController.create)

module.exports = routes
