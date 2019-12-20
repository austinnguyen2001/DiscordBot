import DatabaseCommand from '../databaseCommand';
import { RichEmbed } from 'discord.js';

const timeConversions = {
	s: '1000',
	m: '60000',
	h: '3600000',
	d: '86400000',
}

const days = [
	"Sun",
	"Mon", 
	"Tue", 
	"Wed", 
	"Thr", 
	"Fri", 
	"Sat"
]

const months = [
	"Jan", 
	"Feb", 
	"Mar", 
	"Apr", 
	"May", 
	"Jun", 
	"Jul", 
	"Aug", 
	"Sep", 
	"Oct", 
	"Nov", 
	"Dec"
]

export default class ContestCommand extends DatabaseCommand {
	constructor(client) {
		super(client, {
			name: 'contest',
			group: 'general',
			memberName: 'contest',
			description: 'Displays a list of available commands, or detailed information for a specified command.',
			details: `
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.
			`,
			examples: ['contest', 'contest 3d 4 Item'],
			guarded: true,
			args: [
				{
					key: 'time',
					prompt: 'How long would you like your contest to go for? The time can be in seconds, minutes, hours, or days. Specify the time unit with an "s", "m", "h", or "d")',
					type: 'string',
					validate: text => text.substring(0, text.length - 1)*1 && (text.includes("s") || text.includes("m") || text.includes("h")  || text.includes("d"))
				},
				{
					key: 'winners',
					prompt: 'How many winners do you want?',
					type: 'string',
					validate: text => text.substring(0, text.length)*1
				},
				{
					key: 'prize',
					prompt: 'What is the name of the prize?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) { 
		const currentTime = Date.now();
		const endTime = new Date(currentTime + parseInt(args.time.substring(0, args.time.length - 1), 10) * timeConversions[`${args.time.slice(-1)}`]);

		// Create the RichEmbed
		const embed = new RichEmbed()
			.setTitle(args.prize)
            .setDescription(`React with 👌 to enter! \n Time remaining: ${args.time}`)
            .setColor(0x00AE86)
			.setFooter(`Ends at ${days[endTime.getDay()]} ${months[endTime.getMonth()]} ${endTime.getDate()}, ${endTime.getFullYear()} | at ${endTime.getHours()}:${('0'+endTime.getMinutes()).slice(-2)}`);
		const sentEmbed = await msg.embed(embed);
		const react = await sentEmbed.react('👌');

		// Insert information into db
		const databaseArgs = Object.entries(args).map((arg) => { return { key: arg[0], value: arg[1] } });
		const event = {
            messageId: react.message.id.toString(),
            channelId: msg.channel.id,
			type: 'contest',
			endTime: endTime,
			args: databaseArgs
        }
		this.createEvent(event);
    }
}