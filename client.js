const cheerio = require('cheerio')
const rp = require('request-promise')
const _ = require('partial-js')

const url = 'https://wis.hufs.ac.kr/src08/jsp/lecture/LECTURE2020L.jsp'

const buildForm = courseId => {
  return {
    ag_ledg_year: '2019',
    ag_ledg_sessn: '3',
    ag_org_sect: 'A',
    campus_sect: courseId.slice(0, 2),
    gubun: courseId.startsWith('A') ? '1' : '2',
    ag_crs_strct_cd: courseId,
    ag_compt_fld_cd: courseId
  }
}

const infos = {
  0: 'index',
  3: 'id',
  4: 'name',
  11: 'professor',
  14: 'time',
  15: 'people'
}

const trim = str =>
  str
    .trim()
    .replace(/\s{2,}/, '')
    .replace(/\s?\(.+$/, '')

const fetchCourseHtml = courseId => rp.post(url, { form: buildForm(courseId) })

const lectureList = async courseId => {
  const html = await fetchCourseHtml(courseId)

  const $ = cheerio.load(html)

  const trs = $('div#premier1 > div.table > table > tbody > tr')

  const lectures = $(trs)
    .map((idx, tr) => {
      if (!idx) return

      const lecture = {}

      $(tr)
        .children('td')
        .each((i, td) => infos[i] && (lecture[infos[i]] = trim($(td).text())))

      lecture.isEmpty = isEmpty(lecture.people)

      return lecture
    })
    .get()

  return lectures
}

const filterEmptyLecture = (indeces, lectures) => {
  return indeces
    .map(index => lectures[index])
    .filter(lecture => lecture.isEmpty)
    .map(lecture => lecture.id)
}

const checkLectures = async (courseId, lectures) => {
  try {
    const fetchLectures = await lectureList(courseId)
    return filterEmptyLecture(_.pluck(lectures, 'index'), fetchLectures)
  } catch (error) {
    console.error(error)
    return []
  }
}

function isEmpty(people) {
  try {
    return people && eval(people) < 1
  } catch (e) {}
}

lectureList('AAR01_H1')

/*

const parseLectures = dep => $ =>
  $(trs($))
    .map((idx, tr) => {
      if (!idx) return

      const lecture = { dep }
      $(tr)
        .children('td')
        .each((i, td) => infos[i] && (lecture[infos[i]] = trim($(td).text())))
      // lecture.isEmpty = isEmpty(lecture.people)

      return lecture
    })
    .get()

const asyncMemoize = (fn, cache = {}) => arg =>
  cache[arg]
    ? Promise.resolve(cache[arg])
    : fn(arg).then(res => (cache[arg] = res))

const list = asyncMemoize(dep =>
  _.go(dep, depToUrl, rp, cheerio.load, parseLectures(dep))
)

const filterEmpty = indeces => $ =>
  indeces.filter(idx =>
    _.go(
      $(trs($))
        .eq(idx)
        .children('td')
        .eq(14)
        .text(),
      isEmpty
    )
  )

const check = (dep, indeces) =>
  _.go(dep, depToUrl, rp, cheerio.load, filterEmpty(indeces))

// console.time('r')
// list('(글로벌) 미네르바인문').then(ls => console.log(ls) )
// check('포르투갈어과', [1, 2, 3, 4, 5]).then(console.log)

const Lecture = {
  depToUrl,
  list,
  check
}


*/

const Client = {
  lectureList,
  checkLectures
}

module.exports = Client
