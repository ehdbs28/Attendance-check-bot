import { ApplicationCommandOptionType, Client, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import { Logger, ILogObj } from "tslog";
import { UserData, getUserDataWithId } from "../saveData/userData";
import { UserDataType } from "../types/userData";
import { embedManager } from "..";
import dotenv from "dotenv";
dotenv.config();

const log: Logger<ILogObj> = new Logger();

const standardAttendanceMinute: number = process.env.attendanceMinute === undefined ? 60 : parseInt(process.env.attendanceMinute); 

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

        if(userData.attendanceStartTime == null || !userData.timerRunning){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "먼저 타이머를 시작해주세요.", color: "#C70039" })]
            });
            return;
        }

        const prevDate = new Date(userData.attendanceStartTime);
        let now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
        const kdiff = 9 * 60 * 60 * 1000;
        now = new Date(utc + kdiff); 
        
        const prevTotalMinute = prevDate.getHours() * 60 + prevDate.getMinutes();
        const nowTotalMinute = now.getHours() * 60 + now.getMinutes();
        const diff = Math.abs(prevTotalMinute - nowTotalMinute);

        userData.attendance = diff >= standardAttendanceMinute;
        userData.timerRunning = false;
        
        if(userData.attendance){
            await interaction.followUp({
                ephemeral: true,
                embeds: [
                    embedManager.createEmbed(
                        {
                            title: `${prevDate.getMonth() + 1}월 ${prevDate.getDate()}일 출석을 완료하였습니다!`,
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
                            desc: `출석 기준 시간까지 ${120 - diff}분 남았습니다. \n \`/시작\` 명령어를 통해 타이머를 재개할 수 있습니다.`,
                            color: "#F4C34D"
                        }
                    )
                ]
            });
        }

        UserData.save();
    }
}