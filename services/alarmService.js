const _ = require('partial-js')
const Client = require('../client')
const sendFcm = require('../sendFcm')

const AlarmService = AlarmRepository => ({
  async alarmBatch(req, res) {
    const date = new Date()
    const hour = date.getHours()

    if (!(9 <= hour && hour <= 16)) return console.log('hour skip')

    function checkLectureAndSendAlarm([courseId, lectures]) {
      _.go(
        Client.checkLectures(courseId, lectures),
        _.each(findAlarmAndSendAlarm)
      ).catch(console.error)
    }

    async function findAlarmAndSendAlarm(lectureId) {
      try {
        const alarm = await AlarmRepository.findAlarmToAlert(lectureId)
        await Promise.all(alarm.map(sendFcm))
        AlarmRepository.removeAlertedAlarm(lectureId)
        console.log(`${alarm[0].name} 보냄`)
      } catch (error) {
        console.log(error)
      }
    }

    console.log(`알람 배치 ${new Date().toString()}`)
    _.go(
      AlarmRepository.findAlarmLectures(),
      _.groupBy('course'),
      Object.entries,
      _.each(checkLectureAndSendAlarm)
    ).catch(console.error)
    res && res.send('ㅇㅇ')
  }
})

module.exports = AlarmService
