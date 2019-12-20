import DatabaseCommand from '../databaseCommand';

export default class MeowCommand extends DatabaseCommand {
	constructor(client) {
		super(client, {
			name: 'twitchroles',
			group: 'twitch',
			memberName: 'twitchroles',
			description: 'Get roles based on your twitch account details',
		});
	}

	async run(msg) {
		let user = 'Please link your account first';
		user = await this.getUser(msg.author.id);
		return msg.say(user.discordId);
	}
}