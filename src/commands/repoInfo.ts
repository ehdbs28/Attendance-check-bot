import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import {Logger, ILogObj} from "tslog";
import {Octokit} from "octokit";
import {OctokitResponse} from "@octokit/types"
import { embedManager } from "..";
import { UserDataType } from "../types/userData";
import { getUserDataWithId } from "../saveData/userData";
import { GitRepoData } from "../types/gitDataTypes/gitRepoData";
import { RepoData } from "../saveData/repoData";

const log: Logger<ILogObj> = new Logger();

export const RepoInfoCommand: SlashCommand = {
    name: "repoinfo",
    description: "등록된 레포지토리의 정보를 확인할 수 있습니다.",
    execute: async (client: Client, interaction: CommandInteraction) => {
        const userData: UserDataType | undefined = getUserDataWithId(interaction.user.id);
        const repoData: GitRepoData | undefined = await getGitRepoData(userData);

        if(!userData){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "로그인 후 이용가능한 기능입니다. `/login`을 통해 로그인을 진행해주세요.", color: "#C70039" })]
            });
            return;
        }

        if(!repoData){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "등록된 레포지토리가 없습니다. `/registerrepo`를 통해 레포지토리를 등록해주세요.", color: "#C70039" })]
            });
            return;
        }

        const embed: EmbedBuilder = createRepoDataEmbed(repoData);
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }
}

function createRepoDataEmbed(repoData: GitRepoData){
    const embed = embedManager.createEmbed({
        title: repoData.name,
        title_url: repoData.html_url,
        author: { name: repoData.owner.login },
        desc: repoData.description,
        thumbnail: repoData.owner.avatar_url,
        fields: [
            { name: "Language", value: repoData.language, inline: true },
            { name: "License", value: repoData.license ? `[${repoData.license.name}](${repoData.license.url})` : "none", inline: true}
        ]
    });

    return embed;
}

async function getGitRepoData(userData: UserDataType | undefined){
    if(!RepoData.data || !userData)
        return;

    const owner: string = RepoData.data.owner || '';
    const reponame: string = RepoData.data.reponame || '';
    
    const octokit: Octokit = new Octokit({ auth: userData.token });
    const res: OctokitResponse<GitRepoData> = await octokit.request(`GET /repos/${owner}/${reponame}`);
    return res.data;
}
