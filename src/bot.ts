import 'dotenv/config';
import { Client, Events, GatewayIntentBits} from 'discord.js';
import {commands} from './commands';
import { deployCommands } from './util/deploy-commands';

const client = new Client( {
    //intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent'],
    intents: [GatewayIntentBits.Guilds],
});

client.on('ready', (c) => {
    console.log(`${c.user.username} is online`);
});

client.on('guildCreate', async (guild) => {
    await deployCommands({guildId: guild.id});
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const {commandName} = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);