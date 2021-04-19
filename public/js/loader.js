const loader = document.querySelector(".loader-bg");

export const showLoader = function () {
  loader.style.visibility = "visible";
  loader.style.opacity = 1;
};
export const hideLoader = function () {
  loader.style.opacity = 0;
  setTimeout(() => {
    loader.style.visibility = "hidden";
  }, 300);
};
