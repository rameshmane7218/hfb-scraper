// document.onclick = function (event) {
//   console.log("Someone clicked me");
//   const parent = event.target.parentElement.closest("a");
//   console.log("parent: " + parent);
//   if (parent) return false;
//   return false;
// };
// document.querySelector("a").onclick = function () {
//   return false;
// };
// document.addEventListener("pointerdown", (event) => {
//   console.log("Pointer moved in", event);
//   return false;
// });
let selectedElementSelector = [];
chrome.storage.sync.get("selectedMode", ({ selectedMode }) => {
  if (selectedMode) {
    document.onclick = function (event) {
      console.log("selected Mode", selectedMode);
      console.log("Someone clicked me");
      const parent = event.target.parentElement.closest("a");
      console.log("parent: " + parent);
      if (parent) return false;
      return false;
    };
    document.querySelector("a").onclick = function () {
      return false;
    };
    let classSelector = [];
    turnOnSelector(classSelector, selectedMode);
  } else {
    console.log("not selected");
  }
});
function turnOnSelector(classSelector, selectedMode) {
  document.onclick =
    selectedMode &&
    function (e) {
      // console.log("element", selectorMode, e);
      // let ans = cssPath(e.target);
      // console.log("ans", ans);

      var element = e.target;
      var selector = element.tagName + ":nth-child(" + indexOf(element) + ")";
      while ((element = element.parentElement) != null) {
        if (element.tagName === "body") {
          selector = "body > " + selector;
          break;
        }
        selector =
          element.tagName +
          ":nth-child(" +
          indexOf(element) +
          ") > " +
          selector;
      }
      console.log("selector: " + selector);

      chrome.storage.sync.get("multipleElement", ({ multipleElement }) => {
        console.log("multipleElement: " + multipleElement);

        if (!multipleElement) {
          selectedElementSelector.push(selector);
        } else {
          console.log("Multiple elements selected");
          classSelector.push(selector);
          let commonSelector = getCommonSelector(classSelector);
        }
        console.log("classSelector2", classSelector);
      });
    };
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
function getCommonSelector(arr) {
  if (arr.length >= 2) {
    const [element1, element2] = arr.map((el) =>
      el
        .trim()
        .split(">")
        .map((ele) => ele.trim())
    );

    if (element1.length !== element2.length) {
      alert("Different type element selection is disabled/ not allowed");
      arr.length = 0;
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
      alert("Different type element selection is disabled/ not allowed");
      arr.length = 0;
      return false;
    } else {
      // console.log("final selector", element1.join(">"));
      selectedElementSelector = [element1.join(">")];
      chrome.storage.sync.set({
        selectedElementSelector: selectedElementSelector[0],
      });
    }

    // console.log("element", element1, element2);
  }
}
