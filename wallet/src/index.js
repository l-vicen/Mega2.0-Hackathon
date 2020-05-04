const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const app = express()
const PORT = 3333

app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(routes)

app.listen(PORT)
