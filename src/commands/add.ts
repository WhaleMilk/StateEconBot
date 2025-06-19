import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { User } from "../util/db/db-init";

export const data = new SlashCommandBuilder()
    .setName('add')
    .setDescription('adds value to balance of use')
    .addUserOption(option => 
        option
            .setName('target')
            .setDescription(`user you wish to edit the funds of`)
            .setRequired(true))
    .addIntegerOption(option =>
        option
            .setName('value')
            .setDescription('Amount you wish to add (can be negative)')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        const user = interaction.options.getUser('target');
        const value = interaction.options.getInteger('value');

        if (!user) {
            return await interaction.reply({
                content: 'Please specify a valid user',
                ephemeral: true
            });
        }

        if (!value) {
            return await interaction.reply({
                content: 'Please enter a valid amount',
                ephemeral: true
            });
        }

        // Get user from database
        const userRecord = await User.findByPk(user.id);
        
        if (!userRecord) {
            return await interaction.reply({
                content: `${user.username} is not registered in the system.`,
                ephemeral: true
            });
        }

        console.log(`Adding ${value} credits to ${user.username} (Current balance: ${userRecord.balance})`);

        // Update database
        userRecord.balance += value;
        await userRecord.save();

        console.log(`New balance for ${user.username}: ${userRecord.balance}`);

        return await interaction.reply({
            content: `Added ${value} credits to ${user.username}. New balance: ${userRecord.balance}`
        });
    } catch (error) {
        console.error('Error in add command:', error);
        return await interaction.reply({
            content: 'An error occurred while updating the balance.',
            ephemeral: true
        });
    }
}