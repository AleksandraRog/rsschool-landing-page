import DataClient from "./DataClient";
import MenuItem from './MenuItem';

const lightButton = document.querySelector('.light');
const darkButton = document.querySelector('.dark');

const dataClient = new DataClient();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tabsContainer = document.querySelector('.tabs');
const productsModule = await import('./images/products.json', { with: { type: 'json' } });
const products = productsModule.default.map(item => new MenuItem(item));
var currentPage = 0;

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

  tabsContainer.addEventListener('click', async (event) => {

    const clickedTab = event.target.closest('.tab-item');
    if (!clickedTab || clickedTab.getAttribute('aria-selected') === 'true') return;

    const allTabs = tabsContainer.querySelectorAll('.tab-item');
    allTabs.forEach(tab => {
      tab.setAttribute('aria-selected', 'false');
    });

    clickedTab.setAttribute('aria-selected', 'true');
    const newCategory = clickedTab.dataset.category;

    currentPage = 1;
    const filteredProducts = products.filter(product => product.category === newCategory);

    const currentCards = grid.querySelectorAll('.preview');
    currentCards.forEach(card => card.classList.add('fade-out'));
    await delay(300);
    grid.innerHTML = '';
    renderCarts(filteredProducts);
  });
}

render();

const createImage = (src) => new Promise((res, rej) => {
  const img = new Image();
  img.onload = () => res(img);
  img.onerror = rej;
  img.src = src;
});

const grid = document.querySelector('.grid');
const itemPreview = grid.querySelector('.preview');
const activeRadioElement = document.querySelector('[aria-selected="true"]');
const category = activeRadioElement ? activeRadioElement.dataset.category : 'tea';

const filteredProducts = products.filter(product => product.category === category);

const renderItemPreview = async (product, item = undefined) => {
  if (item === undefined) {
    item = itemPreview.cloneNode(true);
  }
  let img = item.querySelector('.box-product-item');
  let title = item.querySelector('.title');
  let description = item.querySelector('.description-product-item');
  let price = item.querySelector('.price');
  title.textContent = product.name;
  description.textContent = product.description;
  price.textContent = '$' + product.price;
  const imageSrc = `images/${product.category}-${product.id}.png`;
  const newImg = await createImage(imageSrc);
  try {
    const newImg = await createImage(imageSrc);
    newImg.classList.add('box-product-item');
    if (img) {
      img.replaceWith(newImg);
    };
  } catch (error) {
    console.error(`Не удалось загрузить картинку для товара ${product.name}:`, error);
  }
  item.dataset.category = product.category;
  item.id = `product-0${product.id}`;
  item.classList.remove('fade-in', 'fade-out');
  return item;
};

async function renderCarts(products) {
  const itemPreviewCategory = itemPreview.dataset.category;

  products.forEach(async function (product) {
    let newItem = await renderItemPreview(product);
    grid.appendChild(newItem);
    setTimeout(() => {
      newItem.classList.add('fade-in');
    }, 50);
  });

  if (itemPreviewCategory !== category) {
    itemPreview.remove();
  };
};

renderCarts(filteredProducts);
