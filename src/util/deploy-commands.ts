import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { commands } from '../commands';

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN as string);

type DeployCommandsProps = {
    guildId: string;
}

export async function deployCommands({ guildId }: DeployCommandsProps) {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, guildId),
            {
                body: commandsData,
            }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}
