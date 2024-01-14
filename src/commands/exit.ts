import { ApplicationCommandOptionType, Client, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import { Logger, ILogObj } from "tslog";
import { UserData, getUserDataWithId } from "../saveData/userData";
import { UserDataType } from "../types/userData";
import { embedManager } from "..";

export const ExitCommand: SlashCommand = {
    name: "타이머 종료",
    description: "타이머를 종료합니다.",
    execute: async (client: Client, interaction: CommandInteraction) => {
        const userData: UserDataType | undefined = getUserDataWithId(interaction.user.id);
        
        if(!userData){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "사용자 등록 후 이용가능한 서비스입니다.", color: "#C70039" })]
            });
            return;
        }

        // 타이머 체크 해주기
        
        await interaction.followUp({
            ephemeral: true,
            embeds: [
                embedManager.createEmbed({desc: `타이머를 종료합니다.`, color: "#79AC78"}),
            ]
        });
    }
}