const express = require('express')
const routes = express.Router()

const UsersController = require('./controllers/UsersController')
const WalletController = require('./controllers/WalletController')
const FilesController = require('./controllers/FilesController')

routes.post('/users', UsersController.create)
routes.post('/getToken', UsersController.getToken)

routes.get('/wallet', WalletController.hashes)
routes.post('/add', WalletController.create)

routes.post('/share', FilesController.share)
routes.post('/get', FilesController.get)

module.exports = routes
