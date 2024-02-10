import { ApplicationCommandDataResolvable, Client, Interaction, User } from "discord.js";
import Commands from "../commands";
import {Logger, ILogObj} from "tslog";
import { SlashCommand } from "../types/slashCommand";
import dotenv from "dotenv";
import { UserData } from "../saveData/userData";
dotenv.config();

const log: Logger<ILogObj> = new Logger();

const dataResetHour: number = process.env.dataResetHour === undefined ? 0 : parseInt(process.env.dataResetHour);

export class ResetTimer{
    private client: Client;
    private lastCheckDate: Date | null;

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
        let date: Date = new Date(Date.now());
        let hours: number = date.getHours();
        
        let hourCheck: boolean = hours === dataResetHour;
        let alreadyCheckDate: boolean = this.lastCheckDate !== null && 
            this.lastCheckDate.getMonth() === date.getMonth() &&
            this.lastCheckDate.getDate() === date.getDate();

        if(hourCheck && !alreadyCheckDate){
            this.lastCheckDate = date;
            this.SendInformationImbed();
            this.ResetData();
        }
        
        setTimeout(()=>this.TimerCheck(), 1000);
    }
    
    private SendInformationImbed(){
        
    }

    constructor(client: Client){
        this.client = client;
        this.lastCheckDate = null;
    }
}