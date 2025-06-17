import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Collection, ChatInputCommandInteraction} from 'discord.js';
import {commands} from './commands';
import { deployCommands } from './util/deploy-commands';
import {User} from './util/db/db-objects';
import type {User as UserType} from "./util/db/models/Users";
import {Keyv} from 'keyv';
import KeyvSqlite from '@keyv/sqlite';

const client = new Client( {
    //intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent'],
    intents: [GatewayIntentBits.Guilds],
});

export const currency = new Collection<string, UserType>();

client.on('ready', async (c) => {
    console.log(`${c.user.username} is online`);
    for (const guild of c.guilds.cache.values()) {
        await deployCommands({guildId: guild.id});
    }
    const storedBalances = await User.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
});

client.on('guildCreate', async (guild) => {
    await deployCommands({guildId: guild.id});
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const {commandName} = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction as ChatInputCommandInteraction);
    }
});

client.login(process.env.DISCORD_TOKEN);