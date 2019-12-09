import config from './config.json';
import { Client, Collection } from 'discord.js';

const client = new Client();
client.commands = new Collection();

// Get our commands from the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Set commands in our client
for(let i = 0, len = commandFiles.length; i < len; i++) {
    const command = require(`./commands/${commandFiles[i]}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! \nIf you haven't yet added the bot, press the link below`);
    console.log(`https://discordapp.com/oauth2/authorize?client_id=${client.user.toString().match(/\d/g).join("")}&scope=bot`);
    client.user.setActivity("Patrolling da server", {type: "WATCHING"});
});

client.on('message', msg => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});
  
client.login(config.bot_token);