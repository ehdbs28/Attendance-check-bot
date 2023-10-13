import { ApplicationCommand, ApplicationCommandDataResolvable, Client, Interaction } from "discord.js";
import Commands from "../commands";
import {Logger, ILogObj} from "tslog";
import { SlashCommand } from "../types/slashCommand";

const log: Logger<ILogObj> = new Logger();

export class InteractionManager{
    private client: Client;

    public async registerAllInteraction(){
        if(this.client.application){
            await this.client.application?.commands.set(Commands);
            log.info("Successfully registered application commands!");
        }
    }

    public async editInteraction(name: string, data: Partial<ApplicationCommandDataResolvable>){
        try{
            const commands = await this.client.application?.commands.fetch();
            if(commands === undefined) return;
            for(const cmd of commands.values()){
                if(cmd.name === name){
                    this.client.application?.commands.edit(cmd, data);
                    break;
                }
            }
        }
        catch(err){
            log.error(err);
        }
    }

    public async onInteraction(client: Client, interaction: Interaction){
        if(interaction.isCommand()){
            const command = Commands.find((cmd: SlashCommand) => cmd.name === interaction.commandName);
    
            if(command){
                await interaction.deferReply();
                command.execute(client, interaction);
                log.info(`${command.name} handled correctly`);
            }
        }
    }

    constructor(client: Client){
        this.client = client;
    }
}