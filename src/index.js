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
