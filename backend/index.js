const PORT = 8080;
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/scrapper", (req, res) => {
  const data = req.body;
  console.log(data);
  const url = data.pageLink;
  let arr = data.data[0];
  start(arr, url);
  async function start(arr, url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    var contentType = {
      text: "textContent",
      image: "src",
      link: "href",
      html: "innerHTML",
    };
    const names = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(arr.selector)).map(
        (x) => x.contentType[arr.type]
      );
    });
    // const names = await page.evaluate(() => {
    //   return Array.from(document.querySelectorAll(".info strong")).map(
    //     (x) => x.textContent
    //   );
    // });

    // await page.click("#clickme");

    // const clickedData = await page.$eval("#data", (el) => el.textContent);
    // console.log(clickedData);

    // const name = await page.$$eval(
    //   "HTML:nth-child(1)>BODY:nth-child(2)>DIV:nth-child(2)>DIV:nth-child(1)>DIV>P:nth-child(1)",
    //   (names) => {
    //     return names.map((x) => x.textContent);
    //   }
    // );
    // const name = await page.$$eval(arr.selector, (names) => {
    //   return names.map((x) => x.contentType[arr.type]);
    // });

    // await page.type("#ourfield", "blue");
    // await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);

    // const info = await page.$eval("#message", (el) => el.textContent);

    // console.log(info);

    // for (const photo of photos) {
    //   const imagepage = await page.goto(photo);
    //   await fs.writeFile(photo.split("/").pop(), await imagepage.buffer());
    // }

    // await fs.writeFile("name.txt", names.join("\r\n"));
    // await fs.writeFile("data.json", JSON.stringify({ data: name }));
    let finalData = undefined;
    await browser.close();

    if (names) {
      res.send({ message: "data received success", data: names });
    }
  }
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
