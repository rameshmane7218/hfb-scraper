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
  let arr = data.data;
  start(arr, url);
  async function start(arr, url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const names = await page.evaluate((arr) => {
      let max = 0;
      for (let i = 0; i < arr.length; i++) {
        let lenArr = Array.from(
          document.querySelectorAll(arr[i].selector.split("@").join(""))
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
                `${selector[0]}:nth-child(${i + 1})${selector[1]}`
              ) == undefined
                ? ""
                : document.querySelector(
                    `${selector[0]}:nth-child(${i + 1})${selector[1]}`
                  ).textContent;
          } else if (arr[j].type === "image") {
            obj[arr[j].name] =
              document.querySelector(
                `${selector[0]}:nth-child(${i + 1})${selector[1]}`
              ) == undefined
                ? ""
                : document.querySelector(
                    `${selector[0]}:nth-child(${i + 1})${selector[1]}`
                  ).src;
          } else if (arr[j].type === "link") {
            obj[arr[j].name] =
              document.querySelector(
                `${selector[0]}:nth-child(${i + 1})${selector[1]}`
              ) == undefined
                ? ""
                : document.querySelector(
                    `${selector[0]}:nth-child(${i + 1})${selector[1]}`
                  ).href;
          } else if (arr[j].type === "html") {
            obj[arr[j].name] =
              document.querySelector(
                `${selector[0]}:nth-child(${i + 1})${selector[1]}`
              ) == undefined
                ? ""
                : document.querySelector(
                    `${selector[0]}:nth-child(${i + 1})${selector[1]}`
                  ).innerHTML;
          }
        }
        newData.push(obj);
      }

      return newData;
      // let ans = getObjArr();
      // function getObjArr() {
      //   let array = Array.from(
      //     document.querySelectorAll(arr.selector.split("@").join(""))
      //   );
      //   return array.length;
      //   return array.map((x) => {
      //     if (arr.type === "text") {
      //       return x.innerHTML;
      //     } else if (arr.type === "image") {
      //       return x.src;
      //     } else if (arr.type === "link") {
      //       return x.href;
      //     } else if (arr.type === "html") {
      //       return x.innerHTML;
      //     }
      //   });
      // }

      // return Array.from(document.querySelectorAll(arr.selector)).map((x) => {
      //   if (arr.type === "text") {
      //     return x.innerHTML;
      //   } else if (arr.type === "image") {
      //     return x.src;
      //   } else if (arr.type === "link") {
      //     return x.href;
      //   } else if (arr.type === "html") {
      //     return x.innerHTML;
      //   }
      // });
    }, arr);
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

    await browser.close();

    if (names) {
      res.send({ message: "data received success", data: names });
    } else {
      res.send({ message: "data received error" });
    }
  }
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

// var contentType = {
//   text: textContent,
//   image: src,
//   link: href,
//   html: innerHTML,
// };
