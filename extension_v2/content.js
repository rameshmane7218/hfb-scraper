

var Selector = function () {
  this.link = document.getElementById("film");
  this.document = document;
  this.window = window;
  this.selectedRedOutline = [];
  this.selectedElementSelector = "";
  this.classSelector = [];
  this.eventHandler = this.eventHandler.bind(this);
  this.appendToolbar = this.appendToolbar.bind(this);
  this.turnOnSelectorFun = this.turnOnSelectorFun.bind(this);
};

Selector.prototype.addMouseOver = function (event) {
  // console.log("element", event.target);
  let element = event.target;
  if (
    element.id === "on" ||
    element.id === "off" ||
    element.id == "submitSelector" ||
    element.id == "submitToolbar"
  )
    return false;

  element.classList.add("-sitemap-select-item-hover");
};
Selector.prototype.addMouseOut = function (event) {
  let element = event.target;
  if (
    element.id === "on" ||
    element.id === "off" ||
    element.id == "submitSelector" ||
    element.id == "submitToolbar"
  )
    return false;

  element.classList.remove("-sitemap-select-item-hover");
};
Selector.prototype.turnOnHoverEffect = function () {
  this.document.addEventListener("mouseover", this.addMouseOver, {
    capture: true,
  });
  this.document.addEventListener("mouseout", this.addMouseOut, {
    capture: true,
  });
};
Selector.prototype.turnOfHoverEffect = function () {
  this.document.removeEventListener("mouseover", this.addMouseOver, {
    capture: true,
  });
  this.document.removeEventListener("mouseout", this.addMouseOut, {
    capture: true,
  });
};

Selector.prototype.eventHandler = function () {
  console.log("handler", this);
};

Selector.prototype.bindEvent = function () {
  // this.link.addEventListener("click", this.eventHandler);

  this.document.addEventListener("click", this.eventHandler, true);
};

Selector.prototype.removeEventHandler = function () {
  // this.link.removeEventListener("click", this.eventHandler);
  this.document.removeEventListener("click", this.eventHandler, true);
};

Selector.prototype.appendToolbar = function () {
  let toolbar = this.document.createElement("section");
  toolbar.setAttribute("class", "submitToolbar");
  toolbar.setAttribute("id", "submitToolbar");

  let submitBtn = this.document.createElement("button");
  submitBtn.setAttribute("class", "submit-selector");
  submitBtn.setAttribute("id", "submitSelector");
  submitBtn.textContent = "Done Selecting";
  submitBtn.addEventListener(
    "click",
    function (event) {
      // console.log(event);
      this.restore(event.target.parentNode);
    }.bind(this)
  );

  toolbar.append(submitBtn);

  this.document.body.append(toolbar);
};

Selector.prototype.turnOnSelectorFun = function (event) {
  if (
    event.target.id === "on" ||
    event.target.id === "off" ||
    event.target.id == "submitSelector" ||
    event.target.id == "submitToolbar"
  ) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();
  // console.log("hii", this);
  var element = event.target;

  var selector = element.tagName + ":nth-child(" + indexOf(element) + ")";
  while ((element = element.parentElement) != null) {
    if (element.tagName === "body") {
      selector = "body > " + selector;
      break;
    }
    selector =
      element.tagName + ":nth-child(" + indexOf(element) + ") > " + selector;
  }
  // console.log("selector: " + selector);
  // console.log("classSelector: " + this.classSelector);
  this.classSelector.push(selector);
  // console.log("classSelector: " + this.classSelector);
  let commonSelector = getCommonSelector(this.classSelector);
  this.selectedElementSelector = commonSelector;
  if (commonSelector) {
    chrome.storage.sync.set({
      selectedElementSelector: commonSelector,
    });
    let indexOfAtt = commonSelector.indexOf("@");
    let newCommArr = commonSelector.split("");
    newCommArr.splice(indexOfAtt, 1);
    let newSelect = newCommArr.join("");
    this.selectedRedOutline.push(newSelect);
    // console.log("newSelect: " + newSelect);
    let redEle = this.document.querySelectorAll(newSelect);
    for (let i = 0; i < redEle.length; i++) {
      redEle[i].classList.add("-sitemap-select-item-selected");
      // console.log(redEle[i].target);
    }
    console.log("commonSelector:", commonSelector);
    // console.log("classSelector2", this.classSelector);
  } else {
    if (this.selectedRedOutline.length > 0) {
      while (this.selectedRedOutline.length) {
        let removableSelector = this.selectedRedOutline.pop();
        let RemoveRedEle = this.document.querySelectorAll(removableSelector);
        for (let i = 0; i < RemoveRedEle.length; i++) {
          RemoveRedEle[i].classList.remove("-sitemap-select-item-selected");
          // console.log(RemoveRedEle[i].target);
        }
      }
    }
  }

  function indexOf(element) {
    var parent = element.parentNode;
    var child,
      index = 1;
    for (
      child = parent.firstElementChild;
      child;
      child = child.nextElementSibling
    ) {
      if (child === element) {
        return index;
      }
      ++index;
    }
    return -1;
  }
  function getCommonSelector(classSelectorArr) {
    if (classSelectorArr.length >= 2) {
      const checkArr = classSelectorArr.map((el) =>
        el
          .trim()
          .split(">")
          .map((ele) => ele.trim())
      );

      for (let i = 1; i < checkArr.length; i++) {
        let updatedCount = 0;
        for (let j = 0; j < checkArr[i].length; j++) {
          // console.log("el : ", element1[i] + "==" + element2[i]);
          if (
            checkArr[0][j] !== checkArr[i][j] ||
            checkArr[0][j].length !== checkArr[i][j].length
          ) {
            updatedCount++;
            // element1[i] = element1[i].split(":").shift() + "@";
          }
        }
        if (updatedCount > 1) {
          classSelectorArr.length = 0;
          // alert("Different types of element selection is not allowed @0");
          showAlert("Different types of element selection is not allowed @0");
          return;
        }
      }
      const [element1, element2] = classSelectorArr.map((el) =>
        el
          .trim()
          .split(">")
          .map((ele) => ele.trim())
      );

      if (element1.length !== element2.length) {
        classSelectorArr.length = 0;
        // alert("Different types of element selection is not allowed @1");
        showAlert("Different types of element selection is not allowed @1");
        return false;
      }
      let count = 0;
      for (let i = 0; i < element1.length; i++) {
        // console.log("el : ", element1[i] + "==" + element2[i]);
        if (element1[i] !== element2[i]) {
          count++;
          element1[i] = element1[i].split(":").shift() + "@";
        }
      }

      if (count > 1) {
        classSelectorArr.length = 0;
        // alert("Different types of element selection is not allowed @2");
        showAlert("Different types of element selection is not allowed @2");
        return false;
      } else {
        // console.log("final selector", element1.join(">"));
        let selectedElementSelector1 = [element1.join(">")];

        // it will return common selector
        return selectedElementSelector1[0];
      }

      // console.log("element", element1, element2);
    }
  }
};
function showAlert(alertMsg) {
  alert(alertMsg);
}

Selector.prototype.removeSelectedElement = function () {
  if (this.selectedRedOutline.length > 0) {
    while (this.selectedRedOutline.length) {
      let removableSelector = this.selectedRedOutline.pop();
      let RemoveRedEle = this.document.querySelectorAll(removableSelector);
      for (let i = 0; i < RemoveRedEle.length; i++) {
        RemoveRedEle[i].classList.remove("-sitemap-select-item-selected");
        // console.log(RemoveRedEle[i].target);
      }
    }
  }
};

Selector.prototype.turnOnSelector = function () {
  this.document.addEventListener("click", this.turnOnSelectorFun, {
    passive: false,
    capture: true,
  });
};
Selector.prototype.turnOfSelector = function () {
  this.document.removeEventListener("click", this.turnOnSelectorFun, {
    passive: false,
    capture: true,
  });
};

Selector.prototype.restore = function (removeNode) {
  chrome.storage.sync.set({
    selectedElementSelector: this.selectedElementSelector,
  });
  this.turnOfHoverEffect();
  this.turnOfSelector();
  this.removeSelectedElement();
  this.removeEventHandler();
  removeNode.remove();
  this.selectedRedOutline = [];
  this.selectedElementSelector = "";
  this.classSelector = [];
};

var dataScrapper = new Selector();



window.onload = function () {
  dataScrapper.removeEventHandler();
  dataScrapper.turnOfHoverEffect();
  dataScrapper.turnOfSelector();
  dataScrapper.removeSelectedElement();
};

// message listener

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log("started", request.command, request.selectedMode);
  if (request.command == "start") {
    dataScrapper.turnOnHoverEffect();
    dataScrapper.appendToolbar();
    dataScrapper.turnOnSelector();
    console.log("running..");
  } else {
    dataScrapper.turnOfHoverEffect();
    dataScrapper.turnOfSelector();
    dataScrapper.removeSelectedElement();
    console.log("stopping..");
  }

  sendResponse({ result: "Success" });
});
