var kill = require('tree-kill');
const shell = require('shelljs')
const { Client, GatewayIntentBits, ActivityType, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

// Import var .env
require("dotenv").config();
const token = process.env.TOKEN,
     bot_id = process.env.BOT_ID,
     serv_id = process.env.SERV_ID

const commands = [
    new SlashCommandBuilder().setName('start').setDescription('Start Server!'),
    new SlashCommandBuilder().setName('stop').setDescription('Stop Server!')
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(bot_id, serv_id), { body: commands })
    .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error);

var client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
var mcserver;

// The path to 'start.bat'
// const MC_SERVER_START_SCRIPT = "./start.sh";

// The channel ID of your game chat channel
// var gamechat = "1016659388360040479"

// The channel ID of your status voice channel
// var serverstatus = "1016659087246774313"

// The name of the role allowed to start, kill, and send commands to the server
// var consolemaster = "1016659632174940282"

client.on("ready", () => {
    console.log('Bot online! Woohoo!');
    client.user.setActivity('Minecraft Server', { type: ActivityType.WATCHING })
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    // If message is "start" by consolemaster
    if (commandName === "start") {

        console.log('start server');
        // Only start if not running
        if (mcserver == null) {

            await interaction.reply("**Starting Minecraft server. This will take a minute or so.**");
            // client.user.setActivity('Server ✅', { type: ActivityType.WATCHING })
            // Start the server
            shell.exec('./start.sh')
            // mcserver = spawn(MC_SERVER_START_SCRIPT);

            // Server log -> script log
            // mcserver.stdout.on('data', function (data) {
            //     console.log("" + data);

                // Server log -> Discord
                // if (data.length < 2001) {
                //     interaction.reply("" + data);
                // } else if (data.length > 2000) {
                //     interaction.reply("**This message was too long to send! " + data.length + " > 2000! Here's the cut version:**");
                //     interaction.reply("" + data.slice(0, 2000));
                // }

                // Look for chat message
                // if (data.slice(10, 18) == "INFO]: <") {

                //     // Send message to Discord
                //     bot.channels.cache.get(gamechat).send(data.toString().split("INFO]: ")[1]);

                // }

            // });

            // message.guild.channels.resolve(serverstatus).setName('SERVER: UP ✅');



            // mcserver.on('close', async code => {
            //     console.log("child process exited with code " + code);
            //     await interaction.reply("Minecraft server has been closed. (Code: " + code + ")");

            //     // message.guild.channels.resolve(serverstatus).setName('SERVER: DOWN ❌');

            //     // Stop the server
            //     if (mcserver != null) {
            //         kill(mcserver.pid);
            //     }

            //     mcserver = null;
            // });
        }
        else {
            await interaction.reply("**Minecraft server is already running.**");
        }

    } else if (commandName === "stop") {
        console.log("stop")
        // Only stop if running
        if (mcserver != null) {
            await interaction.reply("**Force-stopping Minecraft server...**");

            // Stop the server
            kill(mcserver.pid);
            // message.guild.channels.resolve(serverstatus).setName('SERVER: DOWN ❌');
            mcserver = null;
        }
        // message.guild.channels.resolve(serverstatus).setName('SERVER: DOWN ❌');
        mcserver = null;

    // } else if (message.content.startsWith("-") && message.member.roles.cache.some(role => role.name === consolemaster) && (mcserver != null)) {
    //     var command = message.content.slice(1)
    //     mcserver.stdin.write(command + '\n');

        // in-game discord -> Minecraft
    // } else if (message.channel.id == gamechat && mcserver != null && message.author.id != bot.user.id) {

    //     mcserver.stdin.write('tellraw @a [{\"text\":\"[Discord]\",\"color\":\"gray\"}, {\"text\":\" ' + message.author.username + ': \",\"color\":\"dark_aqua\"},{\"text\":\"' + message.content + '\",\"color\":\"white\"}]' + '\n');

    }

});


// Put your bot token below
client.login(token);