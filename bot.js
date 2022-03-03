import VkBot from 'node-vk-bot-api'


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INIT
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const configGroup = {
    token: process.env.TOKEN,
}
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