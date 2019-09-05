const validateBody = alarm =>
  alarm && alarm.user && alarm.user.id && alarm.lectureId

const UserService = UserRepository => ({
  // /myalarm/:user

  async findUserAlarms(req, res) {
    const user = req.params.user
    const lectures = await UserRepository.findUserAlarms(user)
    console.log('myAlarms', lectures)
    res.send(lectures)
  },
  // POST /myalarm
  async addUserAlarm(req, res) {
    try {
      const alarm = JSON.parse(req.body)
      if (!validateBody(alarm))
        return res.status(422).send('알람을 등록할 수 없습니다.')

      const user = alarm.user.id
      const lectureId = alarm.lectureId

      console.log('알람생성', alarm)
      await UserRepository.addUserAlarm(user, lectureId)
      const lectures = await UserRepository.findUserAlarms(alarm.user.id)

      res.send(lectures)
    } catch (error) {
      console.log(error)
      res.status(422).send(error)
    }
  },
  // DELETE /myalarm/:user/:lectureId
  async removeUserAlarm(req, res) {
    const user = req.params.user
    const lectureId = req.params.lectureId

    console.log('알람삭제', user, lectureId)
    await UserRepository.removeUserAlarm(user, lectureId)

    const lectures = await UserRepository.findUserAlarms(user)
    res.send(lectures)
  },
  // GET /lectures/:courseId
  async listLectures(req, res) {
    const courseId = req.params.courseId

    const lectures = await UserRepository.listLectures(courseId)

    res.send(lectures)
  }
})

module.exports = UserService
