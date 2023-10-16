import { ApplicationCommandOptionType, Client, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import {Logger, ILogObj} from "tslog";
import { UserData } from "../saveData/userData";
import { editChoicesData } from "./registerRepo";
import { embedManager } from "..";

const log: Logger<ILogObj> = new Logger();

export const TokenLoginCommand: SlashCommand = {
    name: "login",
    description: "GitHub 토큰을 입력해 로그인합니다.",
    options: [
        {
            required: true,
            name: "git-id",
            description: "GitHub Id를 입력하세요.",
            type: ApplicationCommandOptionType.String
        },
        {
            required: true,
            name: "token",
            description: "GitHub 토큰을 입력하세요.",
            type: ApplicationCommandOptionType.String
        }
    ],
    execute: async (client: Client, interaction: CommandInteraction) => {
        try{
            const gitId: string = interaction.options.get("git-id")?.value?.toString() || '';
            const token: string = interaction.options.get("token")?.value?.toString() || '';
            await onLogin(gitId, token, interaction);
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({
                    desc: "성공적으로 로그인하였습니다. 새로고침하여 유저 목록을 갱신해주세요.",
                    fields: [
                        {name: "window", value: "ctrl + R", inline: true},
                        {name: "mac", value: "command + R", inline: true} 
                    ],
                    color: "#79AC78"}
                )]
            });
        }
        catch(err){
            log.error(err);
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({desc: "로그인 중 오류가 발생했습니다.", color: "#C70039"})]
            });
        }
    }
}

async function onLogin(gitId: string, token: string, interaction: CommandInteraction){
    UserData.data.push({ id: interaction.user.id, gitId: gitId, token: token });
    await UserData.save();
    editChoicesData();
}