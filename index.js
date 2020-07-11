const TelBot = require('node-telegram-bot-api');
const tmp = require('./settings.js');
const TOKEN = tmp.token;
const bot = new TelBot(TOKEN, {polling: true});

bot.onText(/\/info/, msg => {
    const { id } = msg.from;
    bot.sendMessage(id, 'Привет, это предложка для группы t.me/msc_pcs . Сюда вы можете скинуть свой трек и прикрепить к нему изображение. Максимальный размер файла составляет 20МБ. Чтобы скинуть нам свои треки - начните работу с ботом командой /new_offer');
});

bot.onText(/\/new_offer/, msg => {
    const { id } = msg.chat;

    bot.sendMessage(id, 'Теперь отправьте ваш трек и изображение к нему в формате png/jpg.');

    bot.on('message', msg => {
        let audioFlag = false;
        if (msg.hasOwnProperty('audio')){
            audioFlag = true;

            if (msg.audio.file_size > 20 * 1024 * 1024){
                bot.sendMessage(id, 'Ваш файл слишком много весит.');
                return 0;
            }
        } else {
            if (msg.photo[msg.photo.length - 1].file_size > 20 * 1024 * 1024){
                bot.sendMessage(id, 'Ваш файл слишком много весит.');
                return 0;
            }
        }
        const fileID = (audioFlag) ? msg.audio.file_id : msg.photo[msg.photo.length - 1].file_id;
        if (audioFlag) {
            bot.sendAudio('405197631', fileID, {
                caption: `От юзера: ${msg.from.username} в ${msg.date}`
            });
        } else {
            bot.sendPhoto('405197631', fileID, {
                caption: `От юзера: ${msg.from.username} в ${msg.date}`
            });
        }
    })
})
