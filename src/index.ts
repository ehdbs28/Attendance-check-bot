import {Client, GatewayIntentBits, Interaction} from "discord.js";
import {Logger, ILogObj} from "tslog";
import { UserData } from "./saveData/userData";
import dotenv from "dotenv";
import { InteractionManager } from "./managers/interactionManager";
import { editChoicesData } from "./commands/registerRepo";
import { EmbedManager } from "./managers/embedManager";
import { RepoData } from "./saveData/repoData";
dotenv.config();

const log: Logger<ILogObj> = new Logger();

const token = process.env.token;

let client: Client;
export let interactionManager: InteractionManager;
export let embedManager : EmbedManager;

(async () => {
    const intents = [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
    ];

    client = new Client({
        intents: intents
    });

    interactionManager = new InteractionManager(client);
    embedManager = new EmbedManager(client, "#4B527E");

    client.on("ready", async () => {
        UserData.load();
        RepoData.load();
        editChoicesData();
        await interactionManager.registerAllInteraction();
    });
    client.on("interactionCreate", async(interaction: Interaction) => interactionManager.onInteraction(client, interaction))
    client.on("error", err => {
        log.error(err);
    });

    await client.login(token);
    
    log.info(`Logged in as ${client.user?.tag}`);
})();