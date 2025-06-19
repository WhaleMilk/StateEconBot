import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { User } from "../util/db/db-init";

export const data = new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance')
    .addUserOption(option => 
        option
            .setName('user')
            .setDescription('The user to check the balance of')
            .setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        const user = interaction.options.getUser('user') || interaction.user;
        
        const userRecord = await User.findByPk(user.id);
        
        if (!userRecord) {
            return await interaction.reply({
                content: `${user.username} is not registered in the economy.`,
                ephemeral: true
            });
        }

        return await interaction.reply({
            content: `${user.username} has ${userRecord.balance} credits.`
        });
    } catch (error) {
        console.error('Error in balance command:', error);
        return await interaction.reply({
            content: 'An error occurred while checking the balance.',
            ephemeral: true
        });
    }
}