import { ApplicationCommandOptionChoiceData, ApplicationCommandOptionType, Client, CommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import { UserData, getUserDataWithId } from "../saveData/userData";
import { embedManager, interactionManager } from "..";
import { GitRepoData } from "../types/gitDataTypes/gitRepoData";
import { UserDataType } from "../types/userData";
import { Octokit } from "octokit";
import {OctokitResponse} from "@octokit/types"
import { RepoData } from "../saveData/repoData";

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
        },
        {
            required: true,
            name: "reponame",
            description: "레포지토리의 이름을 입력하세요.",
            type: ApplicationCommandOptionType.String
        }
    ],
    execute: async (client: Client, interaction: CommandInteraction) => {
        const userData: UserDataType | undefined = getUserDataWithId(interaction.user.id);
        
        if(!userData){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "로그인 후 이용가능한 기능입니다. `/login`을 통해 로그인을 진행해주세요.", color: "#C70039" })]
            });
            return;
        }
        
        const owner: string = interaction.options.get("owner")?.value?.toString() || "";
        const reponame: string = interaction.options.get("reponame")?.value?.toString() || "";
        const repoData: GitRepoData | undefined = await getRepoData(userData.token, owner, reponame);

        if(!repoData){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: `\`${owner}/${reponame}\` 레포지토리가 존재하지 않습니다.`, color: "#C70039" })]
            });
            return;
        }

        RepoData.data = { owner, reponame };
        RepoData.save();
        
        await interaction.followUp({
            ephemeral: true,
            embeds: [
                embedManager.createEmbed({desc: `성공적으로 \`${owner}/${reponame}\` 레포지토리를 등록했습니다.`, color: "#79AC78"}),
            ]
        });
    }
}

async function getRepoData(token: string, owner: string, name: string) {
    try{
        const octokit = new Octokit({ auth: token });
        const res: OctokitResponse<GitRepoData> = await octokit.request(`GET /repos/${owner}/${name}`);
        return res.data;
    }
    catch{
        return undefined;
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
        },
        {
            required: true,
            name: "reponame",
            description: "레포지토리의 이름을 입력하세요.",
            type: ApplicationCommandOptionType.String
        }
    ]});
}