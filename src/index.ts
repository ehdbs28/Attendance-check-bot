import {Client, GatewayIntentBits, Interaction} from "discord.js";
import {Logger, ILogObj} from "tslog";
import {SlashCommand} from "./types/slashCommand";
import { UserData } from "./saveData/userData";
import dotenv from "dotenv";
import { InteractionManager } from "./managers/interactionManager";
import { editChoicesData } from "./commands/registerRepo";
dotenv.config();

const log: Logger<ILogObj> = new Logger();

const token = process.env.token;

let client: Client;
export let interactionManager: InteractionManager;

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

    client.on("ready", async () => {
        UserData.load();
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