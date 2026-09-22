import image from './images/lazy.png';
import DataClient from "./DataClient";

const lightButton = document.querySelector('.light');
const darkButton = document.querySelector('.dark');

const dataClient = new DataClient();

async function render() {
  const dataTheme = await dataClient.getItem('theme');
  if (dataTheme) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  darkButton.addEventListener('click', (event) => {
    document.documentElement.setAttribute('data-theme', 'dark');
    dataClient.setItem('theme', true)
  })

  lightButton.addEventListener('click', (event) => {
    document.documentElement.removeAttribute('data-theme')
    dataClient.setItem('theme', false)
  })
}

render();

const createImage = (src) => new Promise((res, rej) => {
  const img = new Image();
  img.onload = () => res(img);
  img.onerror = rej;
  img.src = src;
});

async function render2() {
  const subHeader = document.createElement('h2');
  subHeader.innerHTML = 'This elements was created by js';
  const myImage = await createImage(image);
  document.body.appendChild(subHeader);
  document.body.appendChild(myImage);
}
