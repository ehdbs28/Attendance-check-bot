import { ApplicationCommandChoicesData, ApplicationCommandOptionChoiceData, ApplicationCommandOptionType, Client, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import {Logger, ILogObj} from "tslog";
import { UserData } from "../saveData/userData";
import { interactionManager } from "..";

const log: Logger<ILogObj> = new Logger();

export const RegisterRepoCommand: SlashCommand = {
    name: "registerrepo",
    description: "관리할 레포지토리를 등록합니다.",
    options: [
        {
        required: true,
        name: "owner",
        description: "해당 레포지토리의 주인을 입력하세요.",
        type: ApplicationCommandOptionType.String,
        choices: []
        }
    ],
    execute: async (client: Client, interaction: CommandInteraction) => {
        log.info((<ApplicationCommandChoicesData>RegisterRepoCommand.options?.at(0)).choices);
        await interaction.followUp({
            ephemeral: true,
            content: "test"
        });
    }
}

export function editChoicesData(): void {
    const choicesData: ApplicationCommandOptionChoiceData<string>[] = [];
    for(let i = 0; i < UserData.data.length; i++){
        choicesData.push({ name: UserData.data[i].gitId, value: UserData.data[i].gitId });
    }
    interactionManager.editInteraction(RegisterRepoCommand.name, { 
        options: [
        {
            required: true,
            name: "owner",
            description: "해당 레포지토리의 주인을 입력하세요.",
            type: ApplicationCommandOptionType.String,
            choices: choicesData
        }
    ]});
}