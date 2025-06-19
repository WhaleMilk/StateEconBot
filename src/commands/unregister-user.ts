import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { User, sequelize } from "../util/db/db-init";

export const data = new SlashCommandBuilder()
    .setName('unregister_user')
    .setDescription('Removes user from db')
    .addStringOption(option =>
        option 
            .setName('target')
            .setDescription('Id of user you want to remove')
            .setRequired(true));
            
export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        const userId = interaction.options.getString('target');
        
        if (!userId) {
            return await interaction.reply({ 
                content: 'Please provide a valid user ID', 
                ephemeral: true 
            });
        }
        
        const userRecord = await User.findByPk(userId);
        
        if (!userRecord) {
            console.log(`User ${userId} not found in database`);
            return await interaction.reply({ 
                content: 'This user is not registered in the system', 
                ephemeral: true 
            });
        }
        
        const deletedCount = await userRecord.destroy();
        console.log(`Destroy result:`, deletedCount);
        
        return await interaction.reply({ 
            content: "Successfully deleted user from system" 
        });
    } catch (error) {
        console.error('Error in remove-user command:', error);
        
        // Ensure we always respond to the interaction
        try {
            return await interaction.reply({ 
                content: 'An error occurred while deleting the user. Please try again.', 
                ephemeral: true 
            });
        } catch (replyError) {
            // If the interaction was already replied to or timed out
            console.error('Error replying to interaction:', replyError);
            return;
        }
    }
}