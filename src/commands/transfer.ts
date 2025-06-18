import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {User} from "../util/db/db-objects";
import type {User as UserType} from "../util/db/models/Users";
import { currency } from "../bot";

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
    const fromUser = interaction.user;
    const fromUserData = currency.get(fromUser.id);
    const toUser = interaction.options.getUser('target');
    const toUserData = currency.get(toUser?.id as string);
    const value = interaction.options.getInteger('value');
    if (!fromUserData || !toUserData) {
        return interaction.reply({content: `One or more users in that interaction are not registered.`});
    }
    if (!value) {
        return interaction.reply({content: `Please enter a valid amount`});
    }
    if (value > fromUserData.balance) {
        return interaction.reply({content: `You do not have enough credits to complete that transaction`});
    }

    fromUserData.balance -= value;
    currency.set(fromUser.id, fromUserData);
    toUserData.balance += value;
    currency.set(toUser?.id as string, toUserData);

    return interaction.reply({content: `Succesfully transferred ${value} credits from ${fromUser.username} to ${toUser?.username}'s account!`});
}