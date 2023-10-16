import { APIEmbedField, EmbedAuthorOptions } from "discord.js"

export type EmbedOption = {
    title?: string,
    title_url?: string,
    desc?: string,
    author?: EmbedAuthorOptions,
    thumbnail?: string,
    fields?: APIEmbedField[],
    color?: string,
}