const Router = require('express').Router()

const alarmRouter = alarmService =>
  Router.get('/alarm/batch', alarmService.alarmBatch)

module.exports = alarmRouter
