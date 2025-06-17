import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { User } from "../util/db/db-objects";
import { currency } from "../bot";

export const data = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers user into the economy');

export async function execute(interaction: CommandInteraction) {
    if(currency.has(interaction.user.id)) {
        return interaction.reply({content: `You are already registered in the system!`})!
    }
    try {
        const newUser = await User.create({
            user_id: interaction.user.id,
            balance: 1000
        });
        
        currency.set(interaction.user.id, newUser);
        return interaction.reply({content: `User ${interaction.user.username} registered successfully! Initialized account with 1000 credits.`});
    } catch (error) {
        console.error('Error registering user:', error);
        return interaction.reply({content: 'An error occurred while registering. Please try again.'});
    }
}