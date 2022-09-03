// background.js

let color = "#3aa757";
let selectedMode = false;
let multipleElement = false;
let selectedElementSelector = "";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    selectedMode,
    multipleElement,
    selectedElementSelector,
  });
  console.log("Default selected mode is", `selectedMode: ${selectedMode}`);
  chrome.storage.sync.get("txt", (data) => {
    console.log(data.txt);
  });
});
