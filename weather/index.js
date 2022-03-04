import axios from "axios";

export class Weather {
    constructor() {

    }
    static symbols = {
        celsius: '&#8451;',
        degree: '&#176;',
    }

    static async getJson(city = 'Nizhniy Novgorod') {
        const apiKey = process.env.WEATHER_API_KEY
        const apiCity = city.replace(' ', '+')
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${apiCity}&appid=${apiKey}&units=metric&lang=ru`
        if (process.env.DEV_MODE) console.log(apiUrl);
        return (await axios.get(apiUrl)).data
    }

    static async getString() {}
    static async getFunnyString() {
        const json = await this.getJson()
        return `\
За окнами всё еще родной ${json.name})
На улице где-то ${json.main.temp} ${this.symbols.celsius}, хотя хз
${json.main.feels_like} ${this.symbols.celsius} больше похоже на правду)
А еще там ${json.weather.map(i=>i.description).join(',')} и всё такое)
Счастливых голодных игр, зима близко, а я сосиска)
`
    }
}

console.log(await Weather.getFunnyString())

export default Weather;