const AlarmRepository = ({ QUERY }) => ({
  findAlarmToAlert(lectureId) {
    return QUERY`
      SELECT array_agg(A.user_id) as users, L.id, L.course, L.index, L.name, L.professor, L.time
      FROM alarm AS A INNER JOIN lecture AS L ON A.lecture_id = L.id
      WHERE L.id = ${lectureId}
      GROUP BY L.id`
  },
  findAlarmLectures() {
    return QUERY`SELECT DISTINCT L.id, L.course, L.index, L.name, L.professor, L.time
    FROM alarm AS A INNER JOIN lecture AS L ON A.lecture_id = L.id`
  },
  findAllUserToAlert(lectureId) {
    return QUERY`SELECT user_id FROM alarm WHERE lecture_id=${lectureId}`
  },
  removeAlertedAlarm(lectureId) {
    return QUERY`DELETE FROM alarm WHERE lecture_id = ${lectureId}`
  }
})

module.exports = AlarmRepository
