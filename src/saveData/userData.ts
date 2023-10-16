import { UserDataType } from "../types/userData";
import dotenv from "dotenv";
import { SaveData } from "../class/saveData";
dotenv.config();

export const UserData = new SaveData<UserDataType[]>(
    [],
    process.env.dataPath || '',
    "userData.json"
)

export function getUserDataWithId(id: string) : UserDataType | undefined{
    return UserData.data.find(obj => { return obj.id === id });
}