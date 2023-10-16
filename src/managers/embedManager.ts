import {Client, ColorResolvable, EmbedBuilder } from "discord.js";
import {Logger, ILogObj} from "tslog";
import { EmbedOption } from "../types/embedOption";

const log: Logger<ILogObj> = new Logger();

export class EmbedManager{
    private client: Client;
    private embed: EmbedBuilder;

    private embedColor: string;

    private initEmbedSet(){
        this.embed
            .setColor(<ColorResolvable>this.embedColor)
            .setTimestamp();
    }

    public createEmbed(option?: EmbedOption): EmbedBuilder{
        const embed = this.embed;

        if(option === undefined || option === null)
            return embed;
        
        if(option.title)
            embed.setTitle(option.title);
        if(option.desc)
            embed.setDescription(option.desc);
        if(option.author)
            embed.setAuthor(option.author);
        if(option.thumbnail)
            embed.setThumbnail(option.thumbnail);
        if(option.fields)
            embed.setFields(option.fields);
        if(option.color)
            embed.setColor(<ColorResolvable>option.color);

        return embed;
    }

    constructor(client: Client, embedColor: string){
        this.client = client;
        this.embedColor = embedColor;

        this.embed = new EmbedBuilder();
        this.initEmbedSet();
    }
}