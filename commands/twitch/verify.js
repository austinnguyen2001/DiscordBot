import DatabaseCommand from '../databaseCommand';
import CryptoJS from 'crypto-js';
import config from '../../config.json';

export default class VerifyCommand extends DatabaseCommand {
	constructor(client) {
		super(client, {
			name: 'verify',
			group: 'twitch',
			memberName: 'verify',
			description: 'Connect your twitch account to the discord server',
		});
	}

	run(msg) {
        msg.direct(`http://localhost/auth/${CryptoJS.Rabbit.encrypt(msg.author.id, config.secretKey).toString()}`);
	}
}