import {Client, GatewayIntentBits, Interaction} from "discord.js";
import {Config} from "./config";
import {Logger, ILogObj} from "tslog";
import Commands from "./commands";

const log: Logger<ILogObj> = new Logger();

const token = Config.botToken;

(async () => {
    const intents = [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
    ];

    const client = new Client({
        intents: intents
    });

    client.on("ready", async () => {
        if(client.application){
            await client.application.commands.set(Commands);
            log.info("Successfully registered application commands!");
        }
    });
    client.on("interactionCreate", async(interaction: Interaction) => onInteraction(client, interaction))
    client.on("error", err => {
        log.error(err);
    });

    await client.login(token);
    
    log.info(`Logged in as ${client.user?.tag}`);
})();

async function onInteraction(client: Client, interaction: Interaction){
    if(interaction.isCommand()){
        const command = Commands.find(({ name }) => name === interaction.commandName);

        if(command){
            await interaction.deferReply();
            command.execute(client, interaction);
            log.info(`command ${command.name} handled correctly`);
        }
    }
}