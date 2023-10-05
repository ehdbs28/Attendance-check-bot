import {Client, Events, GatewayIntentBits} from "discord.js";
import {Config} from "./config";
import {Logger, ILogObj} from "tslog";

const log: Logger<ILogObj> = new Logger();

const token = Config.token;

(async () => {
    const intents = [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ];

    const client = new Client({
        intents: intents
    });

    client.on("error", err => {
        log.error(err);
    });

    await client.login(token);
    log.info(`Logged in as ${client.user?.tag}`);
});