import { Client, ColorResolvable, CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import { UserDataType } from "../types/userData";
import {Logger, ILogObj} from "tslog";
import {Octokit} from "octokit";
import {OctokitResponse} from "@octokit/types"
import {GitUserData} from "../types/responseData";
import { UserData } from "../saveData/userData";
import { Config } from "../config";

const log: Logger<ILogObj> = new Logger();

export const UserInfoCommand: SlashCommand = {
    name: "userinfo",
    description: "자신의 정보를 확인할 수 있습니다.",
    execute: async (client: Client, interaction: CommandInteraction) => {
        const userData: GitUserData | undefined = await getGitUserData(interaction);

        if(userData === undefined){
            await interaction.followUp({
                ephemeral: true,
                content: "로그인 후 이용가능한 기능입니다. `/login`을 통해 로그인을 진행해주세요."
            });
            return;
        }

        const embed: EmbedBuilder = createUserDataEmbed(userData, interaction);
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }
}

function createUserDataEmbed(userdata: GitUserData, interaction: CommandInteraction){
    const embed = new EmbedBuilder()
        .setColor(<ColorResolvable>Config.embedMainColor)
        .setTitle(userdata.name)
        .setURL(userdata.html_url)
        .setAuthor({ name: userdata.login, url: userdata.html_url })
        .setDescription(userdata.bio)
        .setThumbnail(userdata.avatar_url)
        .addFields(
            { name: 'Followers', value: userdata.followers.toString(), inline: true },
            { name: 'Following', value: userdata.following.toString(), inline: true },
            { name: 'Created At', value: userdata.created_at.split('T')[0], inline: true }
        )
        .addFields(
            { name: 'Website', value: (userdata.blog != "") ? `[detail](${userdata.blog})` : 'none', inline: true },
            { name: 'Company', value: (userdata.company != null) ? userdata.company : 'none', inline: true },
            { name: 'Location', value: (userdata.location != null) ? userdata.location : 'none', inline: true }
        )   
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()?.toString() });

    return embed;
}

async function getGitUserData(interaction: CommandInteraction){
    const userData: UserDataType | undefined = UserData.data.find(obj => { return obj.id === interaction.user.id });

    if(userData === undefined)
        return;

    const gitId: string = userData.gitId;
    const gitToken: string = userData.token;
    
    const octokit: Octokit = new Octokit({ auth: gitToken });
    const res: OctokitResponse<GitUserData> = await octokit.request(`GET /users/${gitId}`);
    return res.data;
}
