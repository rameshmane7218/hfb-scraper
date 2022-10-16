const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/index.html");
    res.send(`<h1>Welcome to hfb data scraper</h1>`);
});

app.post("/scrapper", (req, res) => {
    const data = req.body;
    console.log(data);
    const url = data.pageLink;
    let arr = data.data;
    start(arr, url);
    async function start(arr, url) {
        try {
            const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
            const page = await browser.newPage();
            await page.goto(url, {
                waitUntil: "networkidle0",
            });

            const names = await page.evaluate((arr) => {
                let max = 0;
                for (let i = 0; i < arr.length; i++) {
                    let lenArr = Array.from(
                        document.querySelectorAll(
                            arr[i].selector.split("@").join("")
                        )
                    );
                    max = Math.max(max, lenArr.length);
                }
                let newData = [];
                for (let i = 0; i < max; i++) {
                    let obj = {};
                    for (let j = 0; j < arr.length; j++) {
                        let selector = arr[j].selector.split("@");
                        if (arr[j].type === "text") {
                            obj[arr[j].name] =
                                document.querySelector(
                                    `${selector[0]}:nth-child(${i + 1})${
                                        selector[1]
                                    }`
                                ) == undefined
                                    ? ""
                                    : document.querySelector(
                                          `${selector[0]}:nth-child(${i + 1})${
                                              selector[1]
                                          }`
                                      ).textContent;
                        } else if (arr[j].type === "image") {
                            obj[arr[j].name] =
                                document.querySelector(
                                    `${selector[0]}:nth-child(${i + 1})${
                                        selector[1]
                                    }`
                                ) == undefined
                                    ? ""
                                    : document.querySelector(
                                          `${selector[0]}:nth-child(${i + 1})${
                                              selector[1]
                                          }`
                                      ).src;
                        } else if (arr[j].type === "link") {
                            obj[arr[j].name] =
                                document.querySelector(
                                    `${selector[0]}:nth-child(${i + 1})${
                                        selector[1]
                                    }`
                                ) == undefined
                                    ? ""
                                    : document.querySelector(
                                          `${selector[0]}:nth-child(${i + 1})${
                                              selector[1]
                                          }`
                                      ).href;
                        } else if (arr[j].type === "html") {
                            obj[arr[j].name] =
                                document.querySelector(
                                    `${selector[0]}:nth-child(${i + 1})${
                                        selector[1]
                                    }`
                                ) == undefined
                                    ? ""
                                    : document.querySelector(
                                          `${selector[0]}:nth-child(${i + 1})${
                                              selector[1]
                                          }`
                                      ).innerHTML;
                        }
                    }
                    newData.push(obj);
                }

                return newData;
            }, arr);

            await browser.close();

            if (names) {
                res.send({ message: "data received success", data: names });
            } else {
                res.send({ message: "data received error" });
            }
        } catch {
            res.status(501).send({ message: "Something went wrong" });
        }
    }
});

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
});
