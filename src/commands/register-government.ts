import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { Government, User } from "../util/db/db-init";

export const data = new SlashCommandBuilder()
    .setName('register_government')
    .setDescription('registers a government for the current server')
    .addStringOption(option => 
        option
            .setName('name')
            .setDescription('Name of government being registered')
            .setRequired(true)
    ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator); //requires admin perms to create government

export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        const guildId = interaction.guildId;
        if (await Government.findByPk(guildId as string)) {
            return await interaction.reply({
                content: `This server already has registered a government!`,
                ephemeral: true
            });
        }

        const newGov = await Government.create({
            guild_id: guildId as string,
            owner_id: interaction.user.id as string,
            balance: 1000,
            name: interaction.options.getString('name') as string,
        })

        await User.upsert({
            user_id: interaction.user.id,
            government_id: guildId as string,
        });

        return await interaction.reply({
            content:`Government for ${interaction.guild?.name} has been registered.`
        });
    } catch (e) {
        console.error('Error registering government: ', e);
        return await interaction.reply({
            content: 'An error occured while registering your government.',
            ephemeral: true});
    }
}