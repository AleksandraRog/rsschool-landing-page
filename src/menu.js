import BurgerMenu from "./BurgerMenu";
import { delay, PAGE_SIZE_768, withLock } from "./config";
import MenuModel from "./MenuModel";
import { renderМоdalCart } from "./ModalCartUI";

const mediaQuery = window.matchMedia("(max-width: 768px)");

const lightButton = document.querySelector(".light");
const darkButton = document.querySelector(".dark");
const grid = document.querySelector(".grid");
const itemPreview = grid.querySelector(".preview");
const refreshButton = document.querySelector(".button-refresh");

const burgerButton = document.querySelector(".button-icon-burger");
const burgerAcide = document.querySelector(".burger-nav");

const burgerMenu = new BurgerMenu(burgerButton, burgerAcide);

const createImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

const menuModel = new MenuModel();

const updatePrice = () => {
  let selectAdditives = [];
  const additives = document.querySelectorAll(".additive-input:checked");
  additives.forEach((input) => {
    selectAdditives.push(input.value);
  });

  const sizeValue = document.querySelector(".size-input:checked").value;
  menuModel.calcPrice(sizeValue, selectAdditives);
};

menuModel.subscribe(stateReducer);

if (mediaQuery.matches) {
  menuModel.pageSize = PAGE_SIZE_768;
}

const tabsContainer = document.querySelector(".tabs");

async function render() {
  mediaQuery.addEventListener("change", handleScreenChange);
  handleScreenChange(mediaQuery);

  darkButton.addEventListener("click", (event) => {
    menuModel.setTheme(true);
  });

  lightButton.addEventListener("click", (event) => {
    menuModel.setTheme();
  });

  tabsContainer.addEventListener("click", async (event) => {
    const clickedTab = event.target.closest(".tab-item");
    if (!clickedTab || clickedTab.getAttribute("aria-selected") === "true") {
      return;
    }
    const newCategory = clickedTab.dataset.category;
    updateCategory(newCategory);
    menuModel.getFilterProduct(newCategory);
  });

  refreshButton.addEventListener(
    "click",
    withLock(() => {
      menuModel.getNextPage();
    }, 400),
  );
}

function handleScreenChange(event) {
  if (event.matches) {
    menuModel.pageSize = PAGE_SIZE_768;
  } else {
    menuModel.pageSize = undefined;
  }
}

async function renderItemPreview(product, item = undefined) {
  if (item === undefined) {
    item = itemPreview.cloneNode(true);
  }

  let img = item.querySelector(".box-product-item");
  let title = item.querySelector(".title");
  let description = item.querySelector(".description-product-item");
  let price = item.querySelector(".price");
  title.textContent = product.name;
  description.textContent = product.description;
  price.textContent = "$" + product.price;
  const imageSrc = `images/${product.category}-${product.id}.png`;
  try {
    const newImg = await createImage(imageSrc);
    newImg.classList.add("box-product-item");
    if (img) {
      img.replaceWith(newImg);
    }
  } catch (error) {
    console.error(
      `Не удалось загрузить картинку для товара ${product.name}:`,
      error,
    );
  }
  item.dataset.category = product.category;
  item.id = `product-0${product.id}`;
  item.classList.remove("fade-in", "fade-out");

  const handleCardClick = (event) => {
    const targetId = event.currentTarget.id;
    menuModel.getModal(targetId);
  };
  item.onclick = handleCardClick;

  return item;
}

async function renderCarts(answer) {
  const data = answer.data;
  const products = data.items;
  products.forEach(async function (product) {
    let newItem = await renderItemPreview(product);
    grid.appendChild(newItem);
    setTimeout(() => {
      newItem.classList.add("fade-in");
    }, 50);
  });

  if (data.finish) {
    refreshButton.classList.add("fade-out");
  } else {
    refreshButton.classList.remove("fade-out");
  }
}

function stateReducer(actionType, payload) {
  switch (actionType) {
    case "currentCategory":
      updateCategoryLayout(payload).catch((err) => console.error(err));
      break;

    case "removeCartsToCount":
      removeCarts(payload);
      break;

    case "addCarts":
      renderCarts(payload);
      break;

    case "theme":
      switchTheme(payload);
      break;

    case "modal":
      renderМоdal(payload).catch((err) => console.error(err));
      break;

    case "calcPrice":
      updatePriceOnScreen(payload);
      break;

    default:
      console.log(`Событие ${actionType} не влияет на DOM этой страницы`);
  }
}

function switchTheme(dataTheme) {
  if (dataTheme) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

async function renderМоdal(answer) {
  const modalCart = renderМоdalCart(answer.data, updatePrice);
  if (modalCart instanceof HTMLDialogElement) {
    document.querySelector(".d-menu").appendChild(modalCart);
    modalCart.showModal();
  }
}

function updatePriceOnScreen(answer) {
  const finalPrice = answer.data;
  const totalPriceElement = document.querySelector(".total-price");
  if (!totalPriceElement) return;
  totalPriceElement.textContent = `${finalPrice.toFixed(2)} $`;
}

async function updateCategoryLayout(answer) {
  const checkedCategory = tabsContainer.querySelector(
    ".tab-item[aria-selected='true']",
  ).dataset.category;
  const currentCategory = menuModel.currentCategory;
  if (checkedCategory !== currentCategory) {
    updateCategory(currentCategory);
  }
  removeCarts();
  await renderCarts(answer);
}

function removeCarts(answer = undefined) {
  const previewsList = grid.querySelectorAll(".preview");
  let previews = [...previewsList];

  previews.reverse();
  if (answer) {
    previews.splice(answer.data * -1);
    if (previews.length > 0) {
      refreshButton.classList.remove("fade-out");
    }
  }

  previews.forEach(async (card) => {
    card.classList.add("fade-out");
    await delay(300);
    card.remove();
  });
}

function updateCategory(category) {
  const allTabs = tabsContainer.querySelectorAll(".tab-item");
  allTabs.forEach((tab) => {
    if (tab.dataset.category === category) {
      tab.setAttribute("aria-selected", "true");
    } else {
      tab.setAttribute("aria-selected", "false");
    }
  });
}

render();
