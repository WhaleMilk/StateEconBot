import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { User, sequelize } from "../util/db/db-init";
import { Transaction } from "sequelize";

export const data = new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer funds to another player')
    .addUserOption(option => 
        option
            .setName('target')
            .setDescription(`User that you wish to send funds to`)
            .setRequired(true))
    .addIntegerOption(option => 
        option
            .setName('value')
            .setDescription('Amount you wish to send')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        const fromUser = interaction.user;
        const toUser = interaction.options.getUser('target');
        const value = interaction.options.getInteger('value');

        if (!toUser) {
            return await interaction.reply({
                content: 'Please specify a valid target user',
                ephemeral: true
            });
        }

        if (!value || value <= 0) {
            return await interaction.reply({
                content: 'Please enter a valid positive amount',
                ephemeral: true
            });
        }

        // Get both users from database
        const [fromUserRecord, toUserRecord] = await Promise.all([
            User.findByPk(fromUser.id),
            User.findByPk(toUser.id)
        ]);

        if (!fromUserRecord || !toUserRecord) {
            return await interaction.reply({
                content: 'One or more users are not registered in the system.',
                ephemeral: true
            });
        }

        if (value > fromUserRecord.balance) {
            return await interaction.reply({
                content: `You don't have enough credits. Your balance: ${fromUserRecord.balance}`,
                ephemeral: true
            });
        }

        console.log(`Transferring ${value} credits from ${fromUser.username} to ${toUser.username}`);
        console.log(`Current balances - From: ${fromUserRecord.balance}, To: ${toUserRecord.balance}`);

        // Update database using a transaction to ensure both updates succeed or both fail
        await sequelize.transaction(async (t: Transaction) => {
            fromUserRecord.balance -= value;
            toUserRecord.balance += value;
            
            await Promise.all([
                fromUserRecord.save({ transaction: t }),
                toUserRecord.save({ transaction: t })
            ]);
        });

        console.log(`New balances - From: ${fromUserRecord.balance}, To: ${toUserRecord.balance}`);

        return await interaction.reply({
            content: `Successfully transferred ${value} credits from ${fromUser.username} to ${toUser.username}!
New balances:
${fromUser.username}: ${fromUserRecord.balance}
${toUser.username}: ${toUserRecord.balance}`
        });
    } catch (error) {
        console.error('Error in transfer command:', error);
        return await interaction.reply({
            content: 'An error occurred while processing the transfer.',
            ephemeral: true
        });
    }
}