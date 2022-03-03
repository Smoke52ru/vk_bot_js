import VkBot from 'node-vk-bot-api'
import {configGroup} from "./configs/config.js";




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INIT
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const bot = new VkBot(configGroup);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// COMMANDS
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bot.command('/start', (ctx) => {
    ctx.reply('Hello!');
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// RUN
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
console.log('running...')
bot.startPolling();