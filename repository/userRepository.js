const UserRepository = ({ QUERY }) => ({
  findUserAlarms(user) {
    return QUERY`
      SELECT L.id, L.course, L.index, L.name, L.professor, L.time
      FROM alarm AS A INNER JOIN lecture AS L ON A.lecture_id = L.id
      WHERE A.user_id = ${user}`
  },
  addUserAlarm(user, lectureId) {
    return QUERY`
      INSERT INTO alarm (user_id, lecture_id)
      SELECT ${user}, ${lectureId}
      WHERE NOT EXISTS (
        SELECT id FROM alarm WHERE user_id=${user} AND lecture_id=${lectureId}
      );`
  },
  removeUserAlarm(user, lectureId) {
    return QUERY`DELETE FROM alarm WHERE user_id = ${user} AND lecture_id = ${lectureId}`
  },
  listLectures(courseId) {
    return QUERY`SELECT id, course, index, name, professor, time FROM lecture 
    WHERE course = ${courseId}`
  }
})

module.exports = UserRepository
