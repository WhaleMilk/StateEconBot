import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { User } from "../util/db/db-init";

export const data = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers user into the economy');

export async function execute(interaction: CommandInteraction) {
    try {
        // Check if user already exists in database
        const existingUser = await User.findByPk(interaction.user.id);
        
        if (existingUser) {
            return await interaction.reply({
                content: `You are already registered in the system!`,
                ephemeral: true
            });
        }

        // Create new user in database
        const newUser = await User.create({
            user_id: interaction.user.id,
            balance: 1000
        });

        console.log(`Registered new user: ${interaction.user.username} (${interaction.user.id}) with balance ${newUser.balance}`);

        return await interaction.reply({
            content: `User ${interaction.user.username} registered successfully! Initialized account with 1000 credits.`
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return await interaction.reply({
            content: 'An error occurred while registering. Please try again.',
            ephemeral: true
        });
    }
}