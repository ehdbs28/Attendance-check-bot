import { CommandInteraction, ChatInputApplicationCommandData, Client, ApplicationCommandOptionData } from "discord.js";

export type SlashCommand = ChatInputApplicationCommandData & {
    execute: (client: Client, interaction: CommandInteraction) => void;
}