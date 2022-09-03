let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c"];
const modes = [true, false];

// Reacts to a button click by making the selected button and saving
// the selection
function handleButtonClick(event) {
  // Remove styling from the previously selected color
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // mark the button as selected
  let selectedMode = event.target.dataset.mode;
  event.target.classList.add(selectedClassName);
  if (selectedMode == "true") {
    selectedMode = true;
  } else {
    selectedMode = false;
  }
  chrome.storage.sync.set({ selectedMode });
  console.log(selectedMode);
}

// Add a button to the page for each supplied color
function constructOptions(buttonColors, modes) {
  chrome.storage.sync.get("color", (data) => {
    let currentColor = data.color;
    // For each color we were porvided...
    for (let i = 0; i < buttonColors.length; i++) {
      // ...create a button with that color
      let button = document.createElement("button");
      button.dataset.mode = modes[i];
      button.style.backgroundColor = buttonColors[i];
      if (i == 0) {
        button.innerText = "On";
      } else if (i == 1) {
        button.innerText = "Off";
      }

      //...Mark the currently selected color...
      if (buttonColors[i] === currentColor) {
        button.classList.add(selectedClassName);
      }

      //...add Registe a listener for when that button is clicked
      button.addEventListener("click", handleButtonClick);
      page.appendChild(button);
    }
  });
}

constructOptions(presetButtonColors, modes);

let handleMultiple = document.getElementById("multiple");

handleMultiple.onclick = function (e) {
  if (e.target.checked) {
    chrome.storage.sync.set({ multipleElement: true });
  } else {
    chrome.storage.sync.set({ multipleElement: false });
  }
};
