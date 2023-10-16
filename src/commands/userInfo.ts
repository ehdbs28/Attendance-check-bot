import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import {Logger, ILogObj} from "tslog";
import {Octokit} from "octokit";
import {OctokitResponse} from "@octokit/types"
import { embedManager } from "..";
import { GitUserData } from "../types/gitDataTypes/gitUserData";
import { UserDataType } from "../types/userData";
import { getUserDataWithId } from "../saveData/userData";

const log: Logger<ILogObj> = new Logger();

export const UserInfoCommand: SlashCommand = {
    name: "userinfo",
    description: "자신의 정보를 확인할 수 있습니다.",
    execute: async (client: Client, interaction: CommandInteraction) => {
        const userData: GitUserData | undefined = await getGitUserData(interaction);

        if(userData === undefined){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embedManager.createEmbed({ desc: "로그인 후 이용가능한 기능입니다. `/login`을 통해 로그인을 진행해주세요.", color: "#C70039" })]
            });
            return;
        }

        const embed: EmbedBuilder = createUserDataEmbed(userData);
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }
}

function createUserDataEmbed(userdata: GitUserData){
    const embed = embedManager.createEmbed({
        title: userdata.name,
        title_url: userdata.html_url,
        author: { name: userdata.login },
        desc: userdata.bio,
        thumbnail: userdata.avatar_url,
        fields : [
            { name: 'Followers', value: userdata.followers.toString(), inline: true },
            { name: 'Following', value: userdata.following.toString(), inline: true },
            { name: 'Created At', value: userdata.created_at.split('T')[0], inline: true },
            { name: 'Website', value: (userdata.blog != "") ? `[link](${userdata.blog})` : 'none', inline: true },
            { name: 'Company', value: (userdata.company != null) ? userdata.company : 'none', inline: true },
            { name: 'Location', value: (userdata.location != null) ? userdata.location : 'none', inline: true }
        ]
    });

    return embed;
}

async function getGitUserData(interaction: CommandInteraction){
    const userData: UserDataType | undefined = getUserDataWithId(interaction.user.id);

    if(!userData)
        return;

    const gitId: string = userData.gitId;
    const gitToken: string = userData.token;
    
    const octokit: Octokit = new Octokit({ auth: gitToken });
    const res: OctokitResponse<GitUserData> = await octokit.request(`GET /users/${gitId}`);
    return res.data;
}
