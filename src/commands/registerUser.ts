import { ApplicationCommandOptionType, Client, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import {Logger, ILogObj} from "tslog";
import { UserData, getUserDataWithId } from "../saveData/userData";
import { embedManager } from "..";

const log: Logger<ILogObj> = new Logger();

export const RegisterUserCommand: SlashCommand = {
    name: "등록하기",
    description: "사용자를 등록합니다.",
    execute: async (client: Client, interaction: CommandInteraction) => {
        try{
            if(getUserDataWithId(interaction.user.id)){
                await interaction.followUp({
                    ephemeral: true,
                    embeds: [embedManager.createEmbed({
                        desc: "이미 등록된 사용자입니다.",
                        color: "#C70039"}
                    )]
                });
                return;
            }

            await onRegister(interaction);
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({
                    title: `성공적으로 사용자가 등록되었습니다!`,
                    desc: "정삭적인 동작을 위해 새로고침하여 사용자 목록을 갱신해주세요.",
                    fields: [
                        {name: "for window", value: "ctrl + R", inline: true},
                        {name: "for mac", value: "command + R", inline: true} 
                    ],
                    color: "#79AC78"}
                )]
            });
        }
        catch(err){
            log.error(err);
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({desc: "사용자를 등록하던 중 오류가 발생했습니다.", color: "#C70039"})]
            });
        }
    }
}

async function onRegister(interaction: CommandInteraction){
    UserData.data.push({ id: interaction.user.id, timerRunning: false, attendance: false, AttendanceStartTime: null });
    await UserData.save();
}