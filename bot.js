import VkBot from 'node-vk-bot-api'
import {expandCommandsObject} from "./utils/commandFunctions.js";
import {getScheduleByPlusDays, getScheduleByWeekday, getScheduleToday} from './schedule/index.js'
import {Weather} from "./weather/index.js";
import KB from "./keyboard/index.js";


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INIT
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Config
const configGroup = {
    token: process.env.TOKEN,
}
const bot = new VkBot(configGroup);

// Commands
const commandPrefixes = ['', '/', '!'];
let commandWords = {
    start: ['start', 'начать'],
    keyboard: ['keyboard', 'клавиатура', 'k', 'к'],
    weather: ['weather', 'погода', 'w'],
    schedule: ['пн', 'вт', 'ср', 'чт', 'пт',
        'сегодня', 'завтра',
        'schedule', 'расписание', 's'],
}
const commands = expandCommandsObject(commandWords, commandPrefixes)


const KBButtons =
    ['пн', 'вт', 'ср', 'чт', 'пт', 'сегодня', 'завтра', 'погода']

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// BOT FUNCTIONS
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

bot.command(commands.start, (ctx) => {
    const message = (
        `Commands:\n` +
        `s [+n] - расписание на n-ный день (напр. +1 - завтра)\n` +
        `w - погода\n` +
        `k - удобная клавиатура (!)\n` +
        `\n` +
        `BugReport:\n ` +
        `При возникновении ошибок в работе бота пишите мне\n` +
        `vk.com/smoke52ru`
    )
    ctx.reply(message)
})

bot.command(commands.keyboard, (ctx) => {
    try {
        const keyboard = new KB(KBButtons, {columns: 5})
        ctx.reply('Лови клаву)', null, keyboard.markup)
    } catch (e) {
        console.error(e)
    }
})

bot.command(commands.schedule, async (ctx) => {
    try {
        const command = ctx.message.text.split(' ')[0]
        switch (command) {
            case 'сегодня':
                ctx.reply(`${await getScheduleToday()}`)
                return
            case 'завтра':
                ctx.reply(`${await getScheduleByPlusDays(1)}`)
                return
            case 'пн':
            case 'вт':
            case 'ср':
            case 'чт':
            case 'пт':
                ctx.reply(`${await getScheduleByWeekday(command)}`)
                return
            default:
                let plusDays = 0
                try {
                    let arg = ctx.message.text.split(' ')[1]
                    plusDays = arg.startsWith('+') ? Number(arg.slice(1)) : 0
                } catch (e) {
                    console.error(e)
                } finally {
                    ctx.reply(`${await getScheduleByPlusDays(plusDays)}`)
                }
        }
    } catch (e) {
        console.error(e)
    }
})

bot.command(commands.weather, async (ctx) => {
    try {
        ctx.reply(`${await Weather.getString()}`)
    } catch (e) {
        console.error(e)
    }
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// RUN
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

console.log('Bot is running...')
const timeOfStart = new Date()
setInterval(() => {
    console.log(`Oscar Mike... ${(Date.now() - timeOfStart) / (1000 * 60 * 60)} hours`)
}, 1000 * 60 * 60)
bot.startPolling();