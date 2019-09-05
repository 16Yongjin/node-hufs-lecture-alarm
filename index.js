const { PostgreSQL } = require('fxsql')
const _ = require('partial-js')
const Client = require('./client')

const { CONNECT } = PostgreSQL
const POOL = CONNECT({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'lectures'
})
const { QUERY } = POOL

const findAlarmToAlert = lectureId => {
  return QUERY`
    SELECT array_agg(A.user_id) as users, L.id, L.course, L.index, L.name, L.professor, L.time
    FROM alarm AS A INNER JOIN lecture AS L ON A.lecture_id = L.id
    WHERE L.id = ${lectureId}
    GROUP BY L.id`
}

const main = async () => {
  try {
    const alarms = await findAlarmToAlert('J11019101')
    console.log(alarms)
  } catch (error) {
    console.error(error)
  }
}

main()
