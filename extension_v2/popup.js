document.addEventListener("DOMContentLoaded", function () {
  let selector = document.getElementById("selector");
  chrome.storage.sync.get("selectedMode", function ({ selectedMode }) {
    if (selectedMode) {
      // selector.checked = true;
      selector.disabled = false;
    } else {
      // selector.checked = false;
      selector.disabled = true;
    }
  });
  selector.onchange = function (event) {
    let value = event.target.checked;

    chrome.storage.sync.set({ selectedMode: value });

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        if (value) {
          // it will send message to dom to run code
          chrome.tabs.sendMessage(
            tabs[0].id,
            { command: "start", selectedMode: value },
            function (response) {
              console.log("response", response);
              chrome.storage.sync.get(
                "selectedElementSelector",
                function ({ selectedElementSelector }) {
                  if (!chrome.runtime.lastError) {
                    // if you have any response
                    console.log("Error:");
                  }
                  console.log("response message", selectedElementSelector);
                }
              );
            }
          );
        } else {
          // it will send message to dom to stop code
          chrome.tabs.sendMessage(
            tabs[0].id,
            { command: "stop", selectedMode: value },
            function (response) {
              console.log(response);
            }
          );
        }
      }
    );
  };
});
