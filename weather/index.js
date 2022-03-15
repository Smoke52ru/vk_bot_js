import axios from "axios";

export class Weather {
    static symbols = {
        celsius: '&#8451;',
        degree: '&#176;',
    }

    static async getFullJSON(city = 'Nizhniy Novgorod') {
        const apiKey = process.env.WEATHER_API_KEY
        const apiCity = city.replace(' ', '+')
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${apiCity}&appid=${apiKey}&units=metric&lang=ru`
        if (process.env.DEV_MODE) console.log(apiUrl);
        return (await axios.get(apiUrl)).data
    }

    static async getSimplifiedJSON() {
        const data = await this.getFullJSON()
        return {
            city: data.name,
            conditions: data.weather.map(i => i.description).join(','),
            tempReal: `${data.main.temp.toFixed(0)} ${this.symbols.celsius}`,
            tempFeelsLike: `${data.main.feels_like.toFixed(0)} ${this.symbols.celsius}`,
            pressure: `${(data.main.pressure * 0.750062).toFixed(0)} мм рт. ст.`,
            humidity: `${data.main.humidity} %`,
            wind: `${data.wind.speed} м/с`,
            clouds: `${data.clouds.all} %`,
            visibility: `${(data.visibility / 1000).toFixed(1)} км`,
            sunrise: `${new Date((data.sys.sunrise + data.timezone) * 1000).toLocaleTimeString()}`,
            sunset: `${new Date((data.sys.sunset + data.timezone) * 1000).toLocaleTimeString()}`,
        }
    }

    static async getString() {
        const json = await this.getSimplifiedJSON()
        return (
            `Погода - ${json.city}\n` +
            `Температура воздуха ${json.tempReal}\n` +
            `Ощущается как ${json.tempFeelsLike}\n` +
            `На улице ${json.conditions}\n` +
            `Ветер: ${json.wind}\n` +
            `Влажность: ${json.humidity}\n` +
            `Видимость: ${json.visibility}\n` +
            `Восход: ${json.sunrise} / Закат: ${json.sunset}\n` +
            `Атмосферное давление: ${json.pressure}`
        )
    }

    static async getFunnyString() {
        const json = await this.getFullJSON()
        return (
            `За окнами всё еще родной ${json.name})\n` +
            `На улице где-то ${json.main.temp} ${this.symbols.celsius}, хотя хз\n` +
            `${json.main.feels_like} ${this.symbols.celsius} больше похоже на правду)\n` +
            `А еще там ${json.weather.map(i => i.description).join(',')} и всё такое)\n` +
            `Счастливых голодных игр, зима близко, а я сосиска)\n\n` +
            `Будь как погодa) Ей абсолютно всё равно, нравится она кому-то или нет)`
        )
    }
}

console.log(await Weather.getString())

export default Weather;