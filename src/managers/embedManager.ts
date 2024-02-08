import {Client, ColorResolvable, Embed, EmbedBuilder } from "discord.js";
import { EmbedOption } from "../types/embedOption";

export class EmbedManager{
    private client: Client;
    private embed: EmbedBuilder;

    private embedColor: string;

    private initEmbedSet(){
        this.embed = new EmbedBuilder();
        this.embed
            .setColor(<ColorResolvable>this.embedColor)
            .setTimestamp();
    }

    public createEmbed(option?: EmbedOption): EmbedBuilder{
        if(option === undefined || option === null)
            return this.embed;

        this.initEmbedSet();
        
        if(option.title)
            this.embed.setTitle(option.title);
        if(option.title_url)
            this.embed.setURL(option.title_url);
        if(option.desc)
            this.embed.setDescription(option.desc);
        if(option.author)
            this.embed.setAuthor(option.author);
        if(option.thumbnail)
            this.embed.setThumbnail(option.thumbnail);
        if(option.fields)
            this.embed.setFields(option.fields);
        if(option.color)
            this.embed.setColor(<ColorResolvable>option.color);

        return this.embed;
    }

    constructor(client: Client, embedColor: string){
        this.client = client;
        this.embedColor = embedColor;

        this.embed = new EmbedBuilder();
        this.initEmbedSet();
    }
}