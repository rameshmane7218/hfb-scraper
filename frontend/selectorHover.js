document.onmouseover = function (e) {
  let ele = e.target;

  ele.onmouseover = function (ele) {
    if (ele.target !== ele.currentTarget) {
      return;
    }

    let element = ele.currentTarget;
    element.classList.add("-sitemap-select-item-hover");
    // console.log("currentTarget", element);
  };

  ele.onmouseout = function (ele) {
    if (ele.target !== ele.currentTarget) {
      return;
    }

    let element = ele.currentTarget;
    element.classList.remove("-sitemap-select-item-hover");
    // console.log("currentTarget", element);
  };
};
