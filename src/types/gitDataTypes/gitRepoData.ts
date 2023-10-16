import { GitUserData } from "./gitUserData"

export type GitRepoData = {
    name: string,
    owner: GitUserData,
    description: string,
    html_url: string
}