let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c"];
const modes = [true, false];
let dataObj = {};
let displayAddNewSelector = document.getElementById("addNewSelector");
let addSelector = document.getElementById("addSelector");
let cancelSelector = document.getElementById("cancelSelector");
let saveSelector = document.getElementById("saveSelector");
let selectorForm = document.getElementById("form");
let selectedKeysbody = document.getElementById("selectedKeysbody");
let scrapData = document.getElementById("scrapData");
let pageUrl = document.getElementById("url");
let downloadFile = document.getElementById("downloadFile");

displayAddNewSelector.onclick = function (event) {
  addSelector.style.display = "block";
  downloadFile.style.display = "none";
  event.preventDefault();
};
cancelSelector.onclick = function (event) {
  addSelector.style.display = "none";
  event.preventDefault();
};
saveSelector.onclick = function (event) {
  chrome.storage.sync.get(
    "selectedElementSelector",
    ({ selectedElementSelector }) => {
      let currData = {
        name: selectorForm.key.value,
        type: selectorForm.type.value,
        selector: selectedElementSelector,
      };
      if (selectedElementSelector == "") {
        alert("Please select selector");

        return;
      } else if (currData.name == "" || currData.type == "") {
        alert("Please fill all details");

        return;
      } else if (dataObj["data"] == undefined) {
        dataObj["data"] = [currData];
        appendData(dataObj["data"]);
      } else {
        if (!checkKey(currData.name, dataObj["data"])) {
          dataObj["data"].push(currData);
          appendData(dataObj["data"]);
        } else {
          alert("key already exists...");
        }
      }
      addSelector.style.display = "none";
      selectorForm.reset();

      function checkKey(name, checkData) {
        let exists = checkData.find((el, i) => el.name == name);
        if (exists) {
          return true;
        } else {
          return false;
        }
      }
    }
  );

  // console.log(dataObj);

  chrome.storage.sync.set({
    selectedElementSelector: "",
  });

  event.preventDefault();
};

function appendData(data) {
  // console.log("Appending data to table...", data);
  selectedKeysbody.innerHTML = null;
  if (data == undefined) {
    return false;
  }
  if (data.length == 0) {
    selectedKeysbody.innerHTML = `<tr>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>`;
  }

  data.map((el, i) => {
    let row = document.createElement("tr");

    let id = document.createElement("td");
    id.textContent = el.name;

    let type = document.createElement("td");
    type.textContent = el.type;

    let selector = document.createElement("td");
    selector.textContent = el.selector;

    let deleteSele = document.createElement("td");
    let deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "deletedSeletor");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      handleDeleteSelector(el, i);
    });
    deleteSele.append(deleteBtn);

    row.append(id, type, selector, deleteSele);

    selectedKeysbody.append(row);
  });
}
scrapData.onclick = function (event) {
  let url = pageUrl.value;
  if (dataObj["data"] == undefined) {
    alert("Please fill data first...");
    return false;
  }
  if (url == "") {
    alert("Please fill pageUrl first...");
    return false;
  }
  dataObj["pageLink"] = url;
  console.log(dataObj);
  let postData = JSON.stringify(dataObj);

  let loading = document.getElementById("loadingIcon");
  let scrapDataBtn = document.getElementById("scrapData");
  scrapDataBtn.disabled = true;
  scrapDataBtn.style.cursor = "not-allowed";
  loading.classList.toggle("btnLoading");
  fetch("http://localhost:8080/scrapper", {
    method: "POST",
    body: postData,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      // console.log(res);
      makeDownloadable(res);
      downloadFile.style.display = "block";
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.classList.toggle("btnLoading");
      scrapDataBtn.disabled = false;
      scrapDataBtn.style.cursor = "pointer";
    });
};

function makeDownloadable(storageObj) {
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(storageObj));
  var dlAnchorElem = document.getElementById("downloadAnchorElem");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "scrapData.json");
  // dlAnchorElem.click();
}
function handleDeleteSelector(el) {
  // console.log("delete selector", el);
  let newData = dataObj["data"].filter((element, i) => element.name != el.name);
  dataObj["data"] = [...newData];
  appendData(newData);
}
// Reacts to a button click by making the selected button and saving
// the selection
function handleButtonClick(event) {
  event.preventDefault();
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
    // handleSendMsg(true);
  } else {
    selectedMode = false;
    // handleSendMsg(false);
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
        button.setAttribute("class", "onCssSelector cssSelectorBtn");
      } else if (i == 1) {
        button.innerText = "Off";
        button.setAttribute("class", "offCssSelector cssSelectorBtn");
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
