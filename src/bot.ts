import 'dotenv/config';
import { Client, Events, GatewayIntentBits, ChatInputCommandInteraction} from 'discord.js';
import {commands} from './commands';
import { deployCommands } from './util/deploy-commands';
import { initializeDatabase } from './util/db/db-init';
import {Keyv} from 'keyv';
import KeyvSqlite from '@keyv/sqlite';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.on('ready', async (c) => {
    console.log(`${c.user.username} is online`);
    
    try {
        // Ensure database is initialized
        await initializeDatabase();
        
        // Deploy commands
        for (const guild of c.guilds.cache.values()) {
            await deployCommands({guildId: guild.id});
        }
        
        console.log('Bot initialization completed successfully');
    } catch (error) {
        console.error('Error during bot initialization:', error);
    }
});

// Register slash commands when bot is added to a server
client.on('guildCreate', async (guild) => {
    await deployCommands({guildId: guild.id});
});

// Slash Command Handler
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const {commandName} = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction as ChatInputCommandInteraction);
    }
});

client.login(process.env.DISCORD_TOKEN);