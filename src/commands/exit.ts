import { ApplicationCommandOptionType, Client, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import { Logger, ILogObj } from "tslog";
import { UserData, getUserDataWithId } from "../saveData/userData";
import { UserDataType } from "../types/userData";
import { embedManager } from "..";

export const ExitCommand: SlashCommand = {
    name: "종료",
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

        if(userData.lastAttendanceTime == null || !userData.todayFirstattendance){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "먼저 타이머를 시작해주세요.", color: "#C70039" })]
            });
            return;
        }

        let now = new Date();
        userData.attendance = AttendanceCheck(userData.lastAttendanceTime, now);
        
        await interaction.followUp({
            ephemeral: true,
            embeds: [
                embedManager.createEmbed({desc: `타이머를 종료합니다.`, color: "#79AC78"}),
            ]
        });
    }
}

function AttendanceCheck(prev: Date | null, now: Date) : boolean {
    if(prev == null){
        return false;
    }

    var prevDate : number = prev.getHours() * 60 + prev.getMinutes();
    var nowDate : number = now.getHours() * 60 + now.getMinutes();
    return Math.abs(nowDate - prevDate) >= 120;
}