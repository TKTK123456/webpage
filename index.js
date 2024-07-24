import http from "http";
import fs from "fs";
import path from "path";
import express from "express";
import ngrok from "@ngrok/ngrok";
const __dirname = path.resolve();
// Create webserver
const app = express();
app.get("/", async (req, res) => {
  const filePath = path.resolve(__dirname, "index.html");
  res.sendFile(filePath);
});
app.listen(8080, () => {
  console.log("Server is up!");
});

(async function () {
  const listener = await ngrok.forward({
    addr: 8080,
    authtoken_from_env: true,
    domain: `starfish-meet-kid.ngrok-free.app`,
  });
  console.log(`Ingress established at: ${listener.url()}`);
})();
app.get("/channelList.txt", function (req, res) {
  console.log("There was a get request!");
});
