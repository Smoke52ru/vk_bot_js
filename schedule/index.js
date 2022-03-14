/*
*   Формат сообщения{
*       [Дата] - [День недели]
*
*       Пары:
*           [Время начала] - [время окончания]
*           [Предмет]
*           [Преподаватель]
*           [Аудитория/аудитории]
*           [Ссылка на конференцию (если есть)]
*   }
*
*/

import axios from "axios";
import {parse} from "node-html-parser";

export class Schedule {

    constructor(userLogin,
                userPassword,
                startDate = new Date().toLocaleDateString(),
                endDate = startDate,
                composeDuplicates = true) {

        this._login = userLogin
        this._password = userPassword
        this._startDate = startDate
        this._endDate = endDate
        this._composeDuplicates = composeDuplicates
    }

    async login(login = this._login,
                password = this._password) {

        const _url = 'https://www.nngasu.ru/cdb/schedule/student.php?login=yes';
        const _dataStr = `AUTH_FORM=Y&TYPE=AUTH&backurl=%2Fcdb%2Fschedule%2Fstudent.php&USER_LOGIN=${login}&USER_PASSWORD=${password}&Login=%C2%EE%E9%F2%E8`


        this._linkToSchedule =
            await axios.post(_url, _dataStr)
                .then((res) => {
                    return parse(res.data).querySelector('iframe').rawAttributes.src
                })
                .catch((e) => {
                    console.error(e)
                })

        return this._linkToSchedule
    }

    async getSchedule(startDate = this._startDate,
                      endDate = startDate,
                      link,
                      composeDuplicates = true) {
        if (!link) {
            link = await this.login()
        }

        this._linkToScheduleWithArgs = (this._linkToSchedule
            + `&ScheduleSearch%5Bstart_date%5D=${startDate}`
            + `&ScheduleSearch%5Bend_date%5D=${endDate}`)

        console.log('DEBUG: ' + this._linkToScheduleWithArgs)

        this.schedule =
            await axios.get(this._linkToScheduleWithArgs)
                .then((res) => {
                    return parse(res.data).querySelectorAll('#schedule-student-container tr')
                })
                .then((rowsDOM) => {
                    // Убираем заголовок
                    rowsDOM = rowsDOM.slice(1)
                    // Считываем день
                    const day = rowsDOM[0].innerText.trim()
                    // Считываем пары
                    let lessons = rowsDOM.slice(1).map((tr) => {
                        const lessonInfo = tr.querySelectorAll("td")
                            .map((td) => td.innerText.trim())

                        try {
                            let lessonLink = tr.querySelector('a').rawAttributes.href
                            return [...lessonInfo, lessonLink]
                        } catch (e) {
                            return lessonInfo
                        }
                    })
                    // Убираем дубли
                    if (composeDuplicates) { //TODO
                        let cleanedLessons = lessons.slice(0, 1)
                        for (let currentLesson of lessons.slice(1)) {
                            if (currentLesson[0] === cleanedLessons[cleanedLessons.length - 1][0] &&
                                currentLesson[1] === cleanedLessons[cleanedLessons.length - 1][1] &&
                                currentLesson[3] === cleanedLessons[cleanedLessons.length - 1][3]
                            ) {
                                cleanedLessons[cleanedLessons.length - 1][4] += `, ${currentLesson[4]}`
                            } else {
                                cleanedLessons.push(currentLesson)
                            }
                        }
                        lessons = cleanedLessons
                    }
                    // Приведение к массиву строк + фильтрация пустых ячеек + разделение \n
                    lessons = lessons.map(lesson => lesson
                        .filter(str => str !== '')
                        .join('\n')
                    )

                    return [day, ...lessons]
                        .join('\n\n')
                        // Фиксим тире
                        .replace(new RegExp('&ndash;', 'g'), ' - ')
                })

        return this.schedule
    }

}

export async function getScheduleByWeekday(str) {
    let weekdays = {
        'пн': 1,
        'вт': 2,
        'ср': 3,
        'чт': 4,
        'пт': 5,
    }

    const schedule = new Schedule(
        process.env.NNGASU_LOGIN,
        process.env.NNGASU_PASSWORD,
        new Date(Date.now() + (weekdays[str] - new Date().getDay()) * (24 * 60 * 60 * 1000)).toLocaleDateString())

    return await schedule.getSchedule()
}

export async function getScheduleByPlusDays(plusDays = 0) {
    const schedule = new Schedule(
        process.env.NNGASU_LOGIN,
        process.env.NNGASU_PASSWORD,
        new Date(Date.now() + plusDays * (24 * 60 * 60 * 1000)).toLocaleDateString())

    return await schedule.getSchedule()
}

export async function getScheduleByLocaleDate(dateString = new Date().toLocaleDateString()) {
    const schedule = new Schedule(
        process.env.NNGASU_LOGIN,
        process.env.NNGASU_PASSWORD,
        dateString)

    return await schedule.getSchedule()
}

export async function getScheduleToday() {
    return await getScheduleByPlusDays()
}

//console.log(await getScheduleByPlusDays(1))
