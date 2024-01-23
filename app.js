const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth')
const routes = require('./routes/router')
const adminRouter = require('./routes/adminRouter')
require('dotenv').config()

const PORT = process.env.PORT
const MONGOURL = process.env.MONGO_URL

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use('/auth', authRouter)
app.use(routes)
app.use('/admin', adminRouter)

mongoose
    .connect(MONGOURL)
    .then((res) => console.log('db connected'))
    .catch((err) => console.log('db error====>', err))

app.get('/', (req, res) => {
    return res.json({ success: true, message: 'Exhaust server started.' })
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
})
// ipv4 address
// http://192.168.100.59:5000