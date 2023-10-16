import fs from "fs";
import {Logger, ILogObj} from "tslog";

const log: Logger<ILogObj> = new Logger();

export class SaveData<T>{
    public data: T;
    public dataPath: string;
    public filePath: string;

    constructor(data: T, dataPath: string, filePath: string){
        this.data = data;
        this.dataPath = dataPath
        this.filePath = filePath
    }

    public save(){
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
    }
        
    public load(){
        if(!fs.existsSync(`${this.dataPath}/${this.filePath}`)){
            log.error("doesnt exist user json file in project!");
            return;
        }

        try{
            const json: string = fs.readFileSync(`${this.dataPath}/${this.filePath}`, "utf8");
            const parsedData: T = JSON.parse(json);
            this.data = parsedData;
            log.info('Successfully loaded user data!');
        }
        catch(err){
            log.error(err);
        }
    }

}