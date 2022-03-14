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
* TODO Почистить дубликаты
*/

import axios from "axios";
import {parse} from "node-html-parser";

export class Schedule {

    constructor(userLogin,
                userPassword,
                startDate = new Date().toLocaleDateString(),
                endDate = startDate,
                composeDublicates = true) {

        this._login = userLogin
        this._password = userPassword
        this._startDate = startDate
        this._endDate = endDate
        this._composeDublicates = composeDublicates
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
                      composeDublicates = true) {
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
                    /*let headers = rowsDOM[0].rawText
                        .split('\n')
                        .map((th) => th.trim())
                        .filter((th) => th)*/

                    return rowsDOM.slice(1)
                        .map((rowDOM) => {
                            let text = rowDOM.rawText
                                .split('\n')
                                .map((rowText) => rowText.trim())
                                .filter((rowText) => rowText)
                                .join('\n')
                            let link = rowDOM.querySelector('a')
                            return text + (link ? '\n' + link.rawAttributes.href : '')
                        })
                        .join('\n\n')
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
