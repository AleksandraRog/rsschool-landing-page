import DataClient from "./DataClient";
import Slider from "./Slider";

const lightButton = document.querySelector(".light");
const darkButton = document.querySelector(".dark");

const dataClient = new DataClient();

const sliderSection = document.querySelector(".d-slider");
const sliderWrapper = sliderSection.querySelector(".row-slider");
const slides = sliderSection.querySelectorAll(".item-slider");
const sliderlist = sliderSection.querySelector(".slider-list");
const sliderTabs = sliderSection.querySelectorAll(".control");
const sliderRightTab = sliderSection.querySelector(".button-icon-right");
const sliderLeftTab = sliderSection.querySelector(".button-icon-left");

async function render() {
  const dataTheme = await dataClient.getItem("theme");
  if (dataTheme) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  darkButton.addEventListener("click", (event) => {
    document.documentElement.setAttribute("data-theme", "dark");
    dataClient.setItem("theme", true);
  });

  lightButton.addEventListener("click", (event) => {
    document.documentElement.removeAttribute("data-theme");
    dataClient.setItem("theme", false);
  });
}

const slider = new Slider(
  sliderWrapper,
  slides,
  sliderlist,
  sliderTabs,
  sliderRightTab,
  sliderLeftTab,
);

render();
