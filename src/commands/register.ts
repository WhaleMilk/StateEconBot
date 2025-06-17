import { CommandInteraction, SlashCommandBuilder, Collection } from "discord.js";
import {User} from "../util/db/db-objects";
import type {User as UserType} from "../util/db/models/Users";
import { currency } from "../bot";

export const data = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers user into the economy');

export async function execute(interaction: CommandInteraction) {
    const newUser = (await new User({user_id: interaction.user.id}));
    currency.set(interaction.user.id, newUser);
    return interaction.reply({content: `User ${interaction.user.username} registered successfully! Initialized account with 1000 credits.`});
}