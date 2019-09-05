const _ = require('partial-js')
const Client = require('../client')
const sendFcm = require('../sendFcm')

const AlarmService = AlarmRepository => ({
  checkLectureAndSendAlarm([courseId, lectures]) {
    _.go(
      Client.checkLectures(courseId, lectures),
      _.each(findAlarmAndSendAlarm)
    ).catch(console.error)
  },
  async findAlarmAndSendAlarm(lectureId) {
    try {
      const alarm = await AlarmRepository.findAlarmToAlert(lectureId)
      await Promise.all(alarm.map(sendFcm))
      AlarmRepository.removeAlertedAlarm(lectureId)
      console.log(`${alarm[0].name} 보냄`)
    } catch (error) {
      console.log(error)
    }
  },
  async alarmBatch(req, res) {
    console.log(`알람 배치 ${new Date().toString()}`)
    _.go(
      AlarmRepository.findAlarmLectures(),
      _.groupBy('course'),
      _.each(checkLectureAndSendAlarm)
    ).catch(console.error)
    res && res.send('ㅇㅇ')
  }
})

module.exports = AlarmService
