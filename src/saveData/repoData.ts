import { UserDataType } from "../types/userData";
import dotenv from "dotenv";
import { SaveData } from "../class/saveData";
import { RepoDataType } from "../types/repoData";
dotenv.config();

export const RepoData = new SaveData<RepoDataType | undefined>(
    undefined,
    process.env.dataPath || '',
    "repoData.json"
);