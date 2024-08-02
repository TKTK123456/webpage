import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import express from "express";
import ngrok from "@ngrok/ngrok";
import { parseFromString } from "dom-parser";
const __dirname = path.resolve();
async function getChapterFromUrl(url) {
  await fetch(url)
    .then((response) => response.text())
    .then(async function (html) {
      const chapterName = html.match(/<title>(.*?)( \-)/)[1];
      const bookTitle = html
        .match(/<title>(.*?)<\/title>/)[1]
        .split(" - ")[1]
        .split(" | ")[0];
      const startLoc = html.indexOf(
        '<div class="chapter-inner chapter-content">',
      );
      const endLoc = html.indexOf("</div>", startLoc);
      let chapter = `<h1>${bookTitle}</h1><h2>${chapterName}</h2>${html.substring(startLoc, endLoc)}`;
      return chapter;
    });
}
async function download(app) {
  app.get("/royalroad/chapterText/url", async (req, res) => {
    const url = req.query.url;
    if (url === undefined || url === "" || url === null) {
      return res.send(`<center><h1>Invalid URL</h1></center>`);
    } else {
      try {
        await fetch(url)
          .then((response) => response.text())
          .then(async function (html) {
            const chapterName = html.match(/<title>(.*?)( \-)/)[1];
            const bookTitle = html
              .match(/<title>(.*?)<\/title>/)[1]
              .split(" - ")[1]
              .split(" | ")[0];
            const startLoc = html.indexOf(
              '<div class="chapter-inner chapter-content">',
            );
            const endLoc = html.indexOf("</div>", startLoc);
            const chapter = `<h1>${bookTitle}</h1><h2>${chapterName}</h2>${html.substring(startLoc, endLoc)}`;
            res.send(chapter);
          });
        return;
      } catch (err) {
        return res.send(`<center><h1>Invalid URL</h1></center>`);
      }
    }
  });
  app.get("/royalroad/chapterText/url/downloadNum", async (req, res) => {
    let url = req.query.url;
    const num = req.query.num;
    if (
      url === undefined ||
      url === "" ||
      url === null ||
      num === undefined ||
      num === "" ||
      num === null
    ) {
      return res.send(`<center><h1>Invalid URL</h1></center>`);
    } else {
      try {
        let chapter = "";
        await fetch(url)
          .then((response) => response.text())
          .then(async function (html) {
            const chapterName = html.match(/<title>(.*?)( \-)/)[1];
            const bookTitle = html
              .match(/<title>(.*?)<\/title>/)[1]
              .split(" - ")[1]
              .split(" | ")[0];
            const startLoc = html.indexOf(
              '<div class="chapter-inner chapter-content">',
            );
            const endLoc = html.indexOf("</div>", startLoc);
            chapter = `<h1>${bookTitle}</h1><h2>${chapterName}</h2>${html.substring(startLoc, endLoc)}`;
            return;
          });
        let Url = url;
        for (let i = 1; i < num; i++) {
          await fetch(Url)
            .then((response) => response.text())
            .then(async function (html) {
              Url = html.match(/<link rel='next' href='(.*?)'\/>/)[1];
              console.log(html.match(/<link rel='next' href='(.*?)'\/>/)[1]); // No need for await
              // Remove return here
            });
          Url = `https://royalroad.com${Url}`;
          console.log(Url)
          await fetch(Url)
            .then((response) => response.text())
            .then(async function (html) {
              const chapterName = html.match(/<title>(.*?)( \-)/)[1];
              const bookTitle = html
                .match(/<title>(.*?)<\/title>/)[1]
                .split(" - ")[1]
                .split(" | ")[0];
              const startLoc = html.indexOf(
                '<div class="chapter-inner chapter-content">',
              );
              const endLoc = html.indexOf("</div>", startLoc);
              chapter += `<br/> <h1>${bookTitle}</h1><h2>${chapterName}</h2>${html.substring(startLoc, endLoc)}`;
              return;
            });
        }
        return res.send(chapter);
      } catch (err) {
        console.log(err);
        return res.send(`<center><h1>Invalid URL</h1></center>`);
      }
    }
  });
}
export default async function runRoyalRoadDownloader(app) {
  app.get("/royalroad/chapterText", async (req, res) => {
    res.render("RoyalRoadDownloader");
  });
  download(app);
}
