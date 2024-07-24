import http from "http";
import fs from "fs";
import bodyParser from "body-parser";
import path from "path";
import express from "express";
import ngrok from "@ngrok/ngrok";
const __dirname = path.resolve();
import { Client, GatewayIntentBits, Collection, Events, Partials} from 'discord.js';
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'html'));
app.post("/home", async (req, res) => {
  const token = req.body.token;
  if (token === undefined || token === "" || token === null) {
    return res.send(`<center><h1>Invalid Token</h1></center>`)
  } else {
    client.login(token)
  }
  res.render('index', { token: token })
});
app.listen(8080, () => {
  console.log("Server is up!");
});

(async function () {
  const listener = await ngrok.forward({
    addr: 8080,
    authtoken_from_env: true,
  });
  console.log(`Ingress established at: ${listener.url()}/login`);
})();
async function getChannels() {
  let output = "";
  for (const guild of client.guilds.cache.values()) {
    for (const channel of guild.channels.cache.values()) {
      output += `${guild.name} - ${channel.name} - ${channel.id}\n`;
    }
  }
  return output
}
app.get("/channels", function (req, res) {
  Promise.resolve(getChannels()).then(
    (value) => {
      return res.send(value); // "Success"
    })
});
app.post("/send", async function (req, res) {
  const token = req.body.token;
  await client.login(token)
  const message = req.body.message;
  const channel = req.body.channel;
  if (message === undefined || message === "" || message === null || channel === undefined || channel === "" || channel === null) {
    res.send(`<center><h1>Invalid Message or Channel ID</h1></center>`)
    return;
  }
  client.channels.cache.get(channel).send(message);
  res.render('send', { token: token});
  return;
}) 
app.get("/login", async (req, res) => {
  const filePath = path.resolve(__dirname, "html/login.html");
  const file = fs.readFileSync(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      return data;
    }
  });
  res.write(file)
});