import bodyParser from "body-parser"; 
import path from "path";
import express from "express";
import ngrok from "@ngrok/ngrok";
const __dirname = path.resolve();
import app from "./discordBot.js";
import runRoyalRoadDownloader from "./RoyalRoadDownloader.js";
app.get("/", async (req, res) => {
  res.render("home");
})
app.listen(8080, () => {
  console.log("Server is up!");
});
(async function () {
  const listener = await ngrok.forward({
    addr: 8080,
    authtoken_from_env: true,
    domain: "starfish-meet-kid.ngrok-free.app",
  });
  console.log(`Ingress established at: ${listener.url()}/`);
})();
runRoyalRoadDownloader(app)