import {Octokit} from "octokit";
import {OctokitResponse} from "@octokit/types"
import {Config} from "../config";
import {ResponseData, CommitData} from "../types/responseData";

const octokit = new Octokit({
    auth: undefined,
});

export class CommitSession{
    public async getUserCommit(username: string, reponame: string){
        const res: OctokitResponse<ResponseData<CommitData>[]> = await octokit.request(`GET /repos/${username}/${reponame}/commits`);
        return res.data[0].responseData;
    }
}