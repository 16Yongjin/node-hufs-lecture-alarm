const Router = require('express').Router()

const userRouter = userService =>
  Router.get('/myalarm/:user', userService.findUserAlarms)
    .post('/myalarm', userService.addUserAlarm)
    .delete('/myalarm/:user/:lectureId', userService.removeUserAlarm)
    .get('/lectures/:courseId', userService.listLectures)

module.exports = userRouter
