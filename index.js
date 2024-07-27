import http from "http";
import fs from "fs";
import bodyParser from "body-parser"; 
import path from "path";
import express from "express";
import ngrok from "@ngrok/ngrok";
const __dirname = path.resolve();
import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  Partials,
  ChannelType,
} from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildWebhooks,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});
// Create webserver
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "html"));
app.use(express.static(__dirname + "/html"));
app.post("discordBotSend/home", async (req, res) => {
  const token = req.body.token;
  if (token === undefined || token === "" || token === null) {
    return res.send(`<center><h1>Invalid Token</h1></center>`);
  } else {
    const tokenRegex = /(mfa\.[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27})/;
    const isValid = token.match(tokenRegex);
    if (
      isValid &&
      isValid !== null &&
      isValid !== undefined &&
      isValid !== ""
    ) {
      try {
        await client.login(token);
      } catch (err) {
        return res.send(`<center><h1>Invalid Token</h1></center>`);
      }
    } else {
      return res.send(`<center><h1>Invalid Token</h1></center>`);
    }
  }
  res.render("index", { token: token });
});
app.listen(8080, () => {
  console.log("Server is up!");
});

(async function () {
  const listener = await ngrok.forward({
    addr: 8080,
    authtoken_from_env: true,
    domain: "starfish-meet-kid.ngrok-free.app",
  });
  console.log(`Ingress established at: ${listener.url()}/login`);
})();
async function getChannels() {
  let output = "";
  for (const guild of client.guilds.cache.values()) {
    for (const channel of guild.channels.cache.values()) {
      if (
        channel.type !== ChannelType.GuildCategory &&
        channel.type !== ChannelType.GuildVoice
      ) {
        output += `${guild.name} - ${channel.name} - ${channel.id}\n`;
      }
    }
  }
  return output;
}
app.post("discordBotSend/channels", function (req, res) {
  Promise.resolve(getChannels()).then((value) => {
    return res.send(value); // "Success"
  });
});
app.post("discordBotSend/send", async function (req, res) {
  const token = req.body.token;
  if (token === undefined || token === "" || token === null) {
    return res.send(`<center><h1>Invalid Token</h1></center>`);
  } else {
    const tokenRegex = /(mfa\.[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27})/;
    const isValid = token.match(tokenRegex);
    if (
      isValid &&
      isValid !== null &&
      isValid !== undefined &&
      isValid !== ""
    ) {
      try {
        await client.login(token);
      } catch (err) {
        return res.send(`<center><h1>Invalid Token</h1></center>`);
      }
    } else {
      return res.send(`<center><h1>Invalid Token</h1></center>`);
    }
  }
  const message = req.body.message;
  const channel = req.body.channel;
  if (
    message === undefined ||
    message === "" ||
    message === null ||
    channel === undefined ||
    channel === "" ||
    channel === null
  ) {
    return res.send(`<h3>Invalid Message or Channel</h3>`);
  }
  try {
    await client.channels.cache.get(channel).send(message);
  } catch (err) {
    return res.send(`<h3>Invalid Message or Channel</h3>`);
  }
  return res.send(`<h3>Message sent!</h3>`);
});
app.get("discordBotSend/login", async (req, res) => {
  res.render("login");
});
async function fetchAllMessages(channelID) {
  let output = "";
  const channel = client.channels.cache.find(channel => channel.id === channelID);
  try {
  const messages = await channel.messages.fetch().then(messages => {
   output = messages.map(message => `${message.author.username} - ${message.content}`).join("\n");
  })
  } catch(err) {
    console.log(err)
    return err;
  }
  output = output.split("\n").reverse().join("\n");
  return output;
}
app.post("discordBotSend/messages", async (req, res) => {
  const channel = req.body.channel;
  Promise.resolve(fetchAllMessages(channel)).then((value) => {
    return res.send(`${value}`); // "Success"
  });
})