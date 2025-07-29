const express = require('express')
const cors = require('cors')
const  connectDB  = require('./config/db.config')
const tradeRoutes = require('./routes/trade.routes')
const userRoutes = require('./routes/user.routes')
const cookieParser = require('cookie-parser')


const app = express()

app.use(cors({
  origin: 'http://localhost:4200',  // your frontend URL
    credentials: true
}
))
app.use(express.json())
app.use(cookieParser());  


connectDB()

 
app.use('/v1', tradeRoutes)

app.use('/v1', userRoutes)

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Trade managment System"
  })
})

module.exports = app