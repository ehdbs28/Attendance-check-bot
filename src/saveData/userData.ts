import fs from "fs";
import { Config } from "../config";
import { UserDataType } from "../types/userData";
import { SaveData } from "../types/saveData";
import {Logger, ILogObj} from "tslog";

const log: Logger<ILogObj> = new Logger();

export const UserData: SaveData<UserDataType[]> = {
    data: [],
    dataPath: Config.dataPath,
    filePath: "userData.json",
    save: async function(){
        if(!fs.existsSync(this.dataPath)){
            try{
                fs.mkdirSync(this.dataPath);
            }
            catch(err){
                log.error(err);
            }
        }
        
        try{
            const json: string = JSON.stringify(this.data);
            fs.writeFileSync(`${this.dataPath}/${this.filePath}`, json);
            log.info('Successfully saved user data!');
        }
        catch(err){
            log.error(err);
        }
    },
    load: async function(){
        if(!fs.existsSync(`${this.dataPath}/${this.filePath}`)){
            log.error("doesnt exist user json file in project!");
            return;
        }

        try{
            const json: string = fs.readFileSync(`${this.dataPath}/${this.filePath}`, "utf8");
            const parsedData: UserDataType[] = JSON.parse(json);
            this.data = parsedData;
            log.info('Successfully loaded user data!');
        }
        catch(err){
            log.error(err);
        }
    },
    clear: async function(){
        this.data = [];
        this.save();
    },
}
