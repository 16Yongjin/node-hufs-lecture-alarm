const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { PostgreSQL } = require('fxsql')
const Looper = require('./services/looper')

const { CONNECT } = PostgreSQL
const POOL = CONNECT({
  host: process.env.POSTGRES_DB || 'localhost',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWARD || 'postgres',
  database: 'lectures'
})

const userRepository = require('./repository/userRepository')(POOL)
const alarmRepository = require('./repository/alarmRepository')(POOL)

const userService = require('./services/userService')(userRepository)
const alarmService = require('./services/alarmService')(alarmRepository)

const userRouter = require('./routers/userRouter')(userService)
const alarmRouter = require('./routers/alarmRouter')(alarmService)
const routers = express.Router().use(userRouter, alarmRouter)

const port = process.env.PORT || 8080

const app = express()

app.use(bodyParser.text())

app.use(cors())

app.use(routers)

app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`)
})

new Looper(alarmService.alarmBatch, 3000)
