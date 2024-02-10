import { ApplicationCommandOptionType, Client, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import { UserData, getUserDataWithId } from "../saveData/userData";
import { UserDataType } from "../types/userData";
import { embedManager } from "..";

export const EnterCommand: SlashCommand = {
    name: "시작",
    description: "타이머를 시작합니다.",
    execute: async (client: Client, interaction: CommandInteraction) => {
        const userData: UserDataType | undefined = getUserDataWithId(interaction.user.id);
        
        if(!userData){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "사용자 등록 후 이용가능한 서비스입니다.", color: "#C70039" })]
            });
            return;
        }

        if(userData.timerRunning){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "이미 타이머가 진행중입니다.", color: "#C70039" })]
            });
            return;
        }

        if(userData.attendanceStartTime == null){
            let now = Date.now();
            userData.attendanceStartTime = now;
            await interaction.followUp({
                ephemeral: true,
                embeds: [
                    embedManager.createEmbed({title: `타이머를 시작합니다.`, desc: `\`/종료\` 명령어를 통해 종료하실 수 있습니다.`, color: "#79AC78"}),
                ]
            });
        }
        else{
            await interaction.followUp({
                ephemeral: true,
                embeds: [
                    embedManager.createEmbed({title: `타이머를 재개합니다.`, desc: `\`/종료\` 명령어를 통해 종료하실 수 있습니다.`, color: "#79AC78"}),
                ]
            });
        }

        userData.timerRunning = true;
        UserData.save();
    }
}