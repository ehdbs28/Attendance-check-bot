import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../types/slashCommand";

export const ping: SlashCommand = {
    name: "ping",
    description: "test slash command",
    execute: async (_, interaction) => {
        await interaction.followUp({
            ephemeral: true,
            content: "pong"
        });
    }
}
