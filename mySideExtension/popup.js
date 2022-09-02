// Initialize button with user's preferred color
const CSS = `div:hover {
  background-color: rgb(207, 249, 235);
}
ul:hover {
  outline: 2px solid yellow !important;
  background-color: rgb(207, 249, 235);
}
p:hover,
h1:hover,
h2:hover,
h3:hover,
h4:hover,
h5:hover,
h6:hover,
li:hover,
label:hover,
img:hover,
a:hover,
span:hover {
  outline: 2px solid green !important;
  background-color: rgba(0, 213, 0, 0.2) !important;
  background: rgba(0, 213, 0, 0.2) !important;
}
.-sitemap-select-item-hover {
  outline: 2px solid green !important;
  background-color: rgba(0, 213, 0, 0.2) !important;
  background: rgba(0, 213, 0, 0.2) !important;
}
`;

const aScript = {
  id: "a-Script",
  js: ["./actions/content.js"],
  matches: ["http://127.0.0.1:5500/*"],
};
let selector = document.getElementById("selector");

selector.onchange = async function (event) {
  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("event", event);
    if (event.target.checked == true) {
      chrome.scripting.executeScript({
        files: ["./actions/content.js"],
        target: { tabId: tab.id },
        // func: setBackgroundColor,
      });
      // chrome.scripting.registerContentScripts([aScript]);
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        css: CSS,
      });
    } else {
      // chrome.scripting.unregisterContentScripts({ ids: [aScript] });
      chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        css: CSS,
      });
    }
  } catch (err) {
    console.log("Something went wrong");
  }
};

// The body of this function will be executed as a content script inside the current page

function setBackgroundColor() {
  console.log("Background Color");
  console.log(
    document.querySelector(
      "#answer-62490056 > div > div.answercell.post-layout--right > div.s-prose.js-post-body > p"
    )
  );
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
  let txt = "Ramesh Mane";
  chrome.storage.sync.set({ txt });
}
