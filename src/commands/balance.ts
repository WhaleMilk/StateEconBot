import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {User} from "../util/db/db-objects";
import type {User as UserType} from "../util/db/models/Users";
import { currency } from "../bot";

export const data = new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance')
    .addUserOption(option => option.setName('user').setDescription('The user to check the balance of').setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const userData = currency.get(user.id);
    if (!userData) {
        return interaction.reply({content: "User is not registered in the economy."});
    }
    return interaction.reply({content: `User ${user.username} has ${userData.balance} credits.`});
}