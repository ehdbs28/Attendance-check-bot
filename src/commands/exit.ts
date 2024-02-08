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

        if(userData.AttendanceStartTime == null || !userData.timerRunning){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "먼저 타이머를 시작해주세요.", color: "#C70039" })]
            });
            return;
        }

        let now = new Date();
        var prevDate : number = userData.AttendanceStartTime.getHours() * 60 + userData.AttendanceStartTime.getMinutes();
        var nowDate : number = now.getHours() * 60 + now.getMinutes();
        var diff = Math.abs(nowDate - prevDate);

        // 나중에 매니저 데이터로 교체하기
        userData.attendance = diff >= 120;
        userData.timerRunning = false;
        
        if(userData.attendance){
            await interaction.followUp({
                ephemeral: true,
                embeds: [
                    embedManager.createEmbed(
                        {
                            title: `${userData.AttendanceStartTime.getMonth()}월 ${userData.AttendanceStartTime.getDay()}일 출석을 완료하였습니다!`,
                            desc: `타이머를 종료합니다.`,
                            color: "#79AC78"
                        }
                    )
                ]
            });
        }
        else{
            await interaction.followUp({
                ephemeral: true,
                embeds: [
                    embedManager.createEmbed(
                        {
                            title: `출석 기준 시간 미달`,
                            desc: `출석 기준 시간까지 ${120 - diff}분 남았습니다. \n /시작 명령어를 통해 타이머를 재개할 수 있습니다.`,
                            color: "#F4C34D"
                        }
                    )
                ]
            });
        }
    }
}