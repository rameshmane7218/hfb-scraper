const PORT = 8080;
const puppeteer = require("puppeteer");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/scrapper", (req, res) => {
  res.send("data received success");
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
