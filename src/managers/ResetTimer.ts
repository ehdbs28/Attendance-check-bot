import { APIEmbed, APIEmbedField, ApplicationCommandDataResolvable, Client, EmbedField, Interaction, User } from "discord.js";
import {Logger, ILogObj} from "tslog";
import dotenv from "dotenv";
import { UserData } from "../saveData/userData";
import { embedManager } from "..";
dotenv.config();

const log: Logger<ILogObj> = new Logger();

const dataResetHour: number = process.env.dataResetHour === undefined ? 0 : parseInt(process.env.dataResetHour);
const notificationChannelId: string = process.env.notificationChannelId === undefined ? '' : process.env.notificationChannelId;

export class ResetTimer{
    private client: Client;
    private lastCheckDate: Date;

    public StartTimerCheck(){
        this.TimerCheck();
    }
    
    private ResetData(){
        log.info("Reset User Data");
        UserData.data.forEach(data => {
            data.attendanceStartTime = null;
            data.attendance = false;
            data.timerRunning = false;
        });
        UserData.save();
    }
    
    private TimerCheck(){
        const interval = 1000;
        setInterval(async () => {
            let now = new Date();
            const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
            const diff = 9 * 60 * 60 * 1000;
            now = new Date(utc + diff); 
            
            let hourCheck: boolean = now.getHours() === dataResetHour;
            let alreadyCheckDate: boolean = this.lastCheckDate.getMonth() === now.getMonth() && this.lastCheckDate.getDate() === now.getDate();

            if(hourCheck && !alreadyCheckDate) {
                this.lastCheckDate = now;
                await this.SendInformationImbed();
                this.ResetData();
            }
        }, interval);
    }
    
    private async SendInformationImbed(){
        let channel = this.client.channels.cache.get(notificationChannelId) 

        if(!channel || !channel.isTextBased()){
            log.error("[ResetTimer] Invalid Channel id");
            return;
        }

        var userFields : APIEmbedField[] = await this.getUserFields();

        channel.send({ embeds: [embedManager.createEmbed({
            title: `${this.lastCheckDate?.getMonth() + 1}/${this.lastCheckDate?.getDate() - 1} 출석 기록을 마무리 합니다.`,
            color: "#205576",
            desc: "오늘 하루 출석 현황을 보여드리겠습니다.",
            fields: userFields
        })]});
    }

    private async getUserFields() : Promise<APIEmbedField[]> {
        let userFields: APIEmbedField[] = [
            { name: "\t", value: "\t", inline: true },
            { name: "\t", value: "\t", inline: true },
            { name: "\t", value: "\t", inline: true },
            { name: "\t", value: "\t", inline: false },
        ];
        
        for (const data of UserData.data) {
            let user = await this.client.users.fetch(data.id);
            let date = new Date(data.attendanceStartTime === null ? 0 : data.attendanceStartTime);
            userFields.push({ name: "유저", value: `${user.displayName}`, inline: true });
            userFields.push({ name: "출석", value: `${data.attendance ? "완료" : "미달"}`, inline: true });
            userFields.push({ name: "출석 시각", value: `${data.attendance ? date.getHours() : '--'} : ${data.attendance ? date.getMinutes() : '--'}`, inline: true });
            userFields.push({ name: "\t", value: "\t", inline: false });
        }

        return userFields;
    }

    constructor(client: Client){
        this.client = client;
        this.lastCheckDate = new Date(0);
    }
}