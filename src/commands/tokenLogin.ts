import { ApplicationCommandOptionType, Client, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import {Logger, ILogObj} from "tslog";
import { UserData } from "../saveData/userData";

const log: Logger<ILogObj> = new Logger();

export const TokenLoginCommand: SlashCommand = {
    name: "login",
    description: "GitHub 토큰을 입력해 로그인합니다.",
    options: [
        {
            required: true,
            name: "token",
            description: "GitHub 토큰을 입력하세요.",
            type: ApplicationCommandOptionType.String
        }
    ],
    execute: async (client: Client, interaction: CommandInteraction) => {
        try{
            await onLogin(interaction.options.get("token")?.value?.toString() || '', interaction);
            await interaction.followUp({
                ephemeral: true,
                content: '성공적으로 로그인하였습니다.'
            });
        }
        catch(err){
            log.error(err);
            await interaction.followUp({
                ephemeral: true,
                content: '로그인 오류가 발생했습니다.',
            });
        }
    }
}

async function onLogin(token: string, interaction: CommandInteraction){
    UserData.data.push({ id: interaction.user.id, token: token });
    await UserData.save();
}