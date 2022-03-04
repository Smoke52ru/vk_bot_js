import VkBot from 'node-vk-bot-api'
import {expandCommandsObject} from "./utils/commandFunctions.js";
import Weather from "./weather/index.js";


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
    test: ['test', 'тест'],
    start: ['start', 'начать'],
    weather: ['weather', 'погода']
}
const commands = expandCommandsObject(commandWords, commandPrefixes)

// Debug info
if (process.env.DEV_MODE) {
    console.log(`COMMANDS: ${JSON.stringify(commands, null, 2)}`)
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// BOT FUNCTIONS
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bot.command(commands.test, (ctx) => {
    ctx.reply('Hello!');
});
//TODO Keyboard
bot.command(commands.start, (ctx) => {
    console.log('лови клаву')
    ctx.reply('Лови клаву)',null, VkBotMarkup
        .keyboard([[
            VkBotMarkup.button('Погода', 'primary'),
        ]]))
})

console.log(JSON.stringify(await Weather.getJson(), null, 2))
bot.command(commands.weather, async (ctx) => {
    ctx.reply(`${await Weather.getFunnyString()}`)
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// RUN
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
console.log('running...')
bot.startPolling();