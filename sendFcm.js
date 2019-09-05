const rp = require('request-promise')

const uri = 'https://fcm.googleapis.com/fcm/send'
const Authorization =
  'key=AAAAF0fPUwk:APA91bGP8nfVgRPNlDMAlWp49b2OyJch2sVfIWYGdbTQ0QFDVmoOpzLuXRvAT9DuhMGxFcmgmcu2qQQEUUNSCpwWWV8GV_AsDTD8iABjWSz1kZ1mJRsS9iwODl7TR3j1ddIejTaQ8D_v'

const buildAlarmMessage = alarm => ({
  registration_ids: alarm.users,
  notification: {
    title: `${alarm.name} / ${alarm.professor} / ${alarm.time} 자리 났습니다.`,
    icon: 'noti-icon.png'
  }
})

const sendFcm = alarm =>
  rp({
    method: 'POST',
    uri,
    headers: { Authorization },
    body: buildAlarmMessage(alarm),
    json: true
  })

// sendFcm({
//   users: [
//     'f14qQcDH_30:APA91bHohz2ZeJe5LUkf-AWUSHHlLrzn5oGszlIOYL8E4a3HIDFvKjGpzMQa-JrIAQm_rUOP4ug4mn06mT6X0Ks_7iGQCYP6mtSLr1o4GJPHsu2bN4FINN85ygy73idHEIQCSaYRsoO6'
//   ],
//   id: 'J11019101',
//   course: 'AAR01_H1',
//   index: 0,
//   name: '러시아.투르크.몽골의',
//   professor: '이평래',
//   time: '월 7 8'
// }).then(console.log)
module.exports = sendFcm
