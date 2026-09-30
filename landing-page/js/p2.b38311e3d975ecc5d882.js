/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./BurgerMenu.js"
/*!***********************!*\
  !*** ./BurgerMenu.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class BurgerMenu {
  constructor(burgerButton, asidePanel) {
    this.burgerButton = burgerButton;
    this.asidePanel = asidePanel;
    this.navItems = this.asidePanel.querySelectorAll(".link");
    this.mediaQuery = window.matchMedia("(max-width: 870px)");
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.onClickBurgerButton = this.handleBurgerButton.bind(this);
    this.burgerButton.addEventListener("click", this.onClickBurgerButton);

    this.onClickNavLink = this.handlePanelClick.bind(this);
    this.asidePanel.addEventListener("click", this.onClickNavLink);

    this.onScreenChangeHandler = this.handleScreenChange.bind(this);
    this.mediaQuery.addEventListener("change", this.onScreenChangeHandler);

    this.onCancelHandler = this.handleCancel.bind(this);
    document.addEventListener("keydown", this.onCancelHandler);
  }

  handleBurgerButton() {
    this.asidePanel.classList.toggle("active");
    this.burgerButton.classList.toggle("active");

    const isOpen = this.asidePanel.classList.contains("active");
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  handleScreenChange(event) {
    if (!event.matches) {
      this.asidePanel.classList.remove("active");
      this.burgerButton.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  handlePanelClick(event) {
    const clickedLink = event.target.closest(".link");
    if (!clickedLink) return;
    this.handleBurgerButton();
  }

  handleCancel(event) {
    if (event.key !== "Escape") return;
    const isOpen = this.asidePanel.classList.contains("active");
    if (isOpen) {
      this.handleBurgerButton();
    }
  }

  destroy() {
    this.burgerButton.removeEventListener("click", this.onClickBurgerButton);
    this.asidePanel.removeEventListener("click", this.onClickNavLink);
    this.mediaQuery.removeEventListener("change", this.onScreenChangeHandler);
    document.body.style.overflow = "";
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BurgerMenu);


/***/ },

/***/ "./DataClient.js"
/*!***********************!*\
  !*** ./DataClient.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

class DataClient {
  constructor(namespace = "coffee-house") {
    this.namespace = namespace;
  }

  async getItem(key = '') {
    const value = localStorage.getItem(`${this.namespace}:${key}`);
    return value ? JSON.parse(value) : null;
  }

  setItem(key = '', value = undefined) {
    localStorage.setItem(`${this.namespace}:${key}`, JSON.stringify(value));
  }

  removeItem(key = '') {
    localStorage.removeItem(`${this.namespace}:${key}`);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DataClient);


/***/ },

/***/ "./ItemUI.js"
/*!*******************!*\
  !*** ./ItemUI.js ***!
  \*******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class ItemUI {
  constructor({
    tag = "div",
    classNames = [],
    inners = [],
    text = undefined,
    value = undefined,
    attrs = {},
    events = {},
  } = {}) {
    this.tag = tag;
    this.classNames = classNames;
    this.inners = inners;
    this.text = text;
    this.value = value;
    this.attrs = attrs;
    this.events = events;
    this.uiElement = this.createMyElement();
  }

  createMyElement() {
    let element = document.createElement(this.tag);

    this.classNames.forEach((className) => {
      element.classList.add(className);
    });

    if (this.text) {
      element.innerText = this.text;
    }

    Object.entries(this.attrs).forEach(([k, v]) => element.setAttribute(k, v));

    if (this.value !== undefined) {
      element.value = this.value;
    }

    Object.entries(this.events).forEach(([eventName, handler]) => {
      if (typeof handler === "function") {
        element.addEventListener(eventName, handler);
      }
    });

    this.inners.forEach((innerElement) => {
      if (innerElement instanceof ItemUI) {
        element.appendChild(innerElement.uiElement);
      } else if (innerElement instanceof HTMLElement) {
        element.appendChild(innerElement);
      }
    });

    return element;
  }

  destroy() {
    this.inners.forEach((inner) => {
      if (inner instanceof ItemUI) {
        inner.destroy();
      }
    });

    if (this.uiElement && this.uiElement.parentNode) {
      this.uiElement.remove();
    }

    this.uiElement = null;
    this.inners = [];
    this.events = {};
  }

  static create(tagAndClasses, configOrInners = {}, possibleInners = []) {
    let targetString = tagAndClasses.trim();
    if (targetString.startsWith(".")) {
      targetString = "div" + targetString;
    }

    const parts = targetString.split(".");
    const tag = parts[0] || "div";
    const classNames = parts.slice(1);

    let config = {};
    let inners = possibleInners;

    if (Array.isArray(configOrInners)) {
      inners = configOrInners;
    } else if (
      typeof configOrInners === "string" ||
      typeof configOrInners === "number"
    ) {
      config.text = configOrInners;
    } else {
      config = { ...configOrInners };
    }

    if (inners.length > 0) config.inners = inners;
    config.tag = tag;
    config.classNames = [...classNames, ...(config.classNames || [])];

    return new ItemUI(config);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ItemUI);


/***/ },

/***/ "./MenuItem.js"
/*!*********************!*\
  !*** ./MenuItem.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class MenuItem {
  constructor({ id, name, description, price, category, sizes, additives }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.sizes = sizes;
    this.additives = additives;

    this._sizeMap = new Map(
      Object.entries(sizes).map(([key, value]) => [
        key.toUpperCase(),
        {
          size: value.size,
          addPrice: parseFloat(value["add-price"]),
        },
      ]),
    );
  }

  get getSizes() {
    return this._sizeMap;
  }

  totalPrice(size, additives = []) {
    let finalPrice = parseFloat(this.price);
    const activeSizeKey = size.toUpperCase();

    if (this._sizeMap.has(activeSizeKey)) {
      finalPrice += this._sizeMap.get(activeSizeKey).addPrice;
    }

    additives.forEach((name) => {
      const activeAdditive = this.additives.find(
        (additive) => additive.name === name,
      );

      if (activeAdditive && activeAdditive["add-price"]) {
        finalPrice += parseFloat(activeAdditive["add-price"]);
      }
    });
    return finalPrice;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MenuItem);


/***/ },

/***/ "./MenuModel.js"
/*!**********************!*\
  !*** ./MenuModel.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DataClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DataClient */ "./DataClient.js");
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MenuItem */ "./MenuItem.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config */ "./config.js");





class MenuModel {
  constructor() {
    this._products = [];
    this._category = "";
    this._currentPage = 0;
    this._pageSize = undefined;
    this._currentCart = undefined;
    this._theme = false;
    this.dataClient = new _DataClient__WEBPACK_IMPORTED_MODULE_0__["default"]();

    const defaultState = {
      currentCategory: [],
      addCarts: [],
      modal: null,
      theme: false,
      calcPrice: 0,
      removeCartsToCount: 0,
    };

    this._state = new Proxy(defaultState, {
      set: (target, property, value) => {
        if (target[property] === value) return true;
        target[property] = value;

        if (this.listener) {
          this.listener(property, value);
        }

        return true;
      },
    });
  }

  async init() {
    const dataTheme = await this.dataClient.getItem("theme");

    const productsModule = await __webpack_require__.e(/*! import() */ "images_products_json").then(() => (__webpack_require__.t(/*! ./images/products.json */ "./images/products.json", 17)));
    this._products = productsModule.default.map((item) => new _MenuItem__WEBPACK_IMPORTED_MODULE_1__["default"](item));

    this._category = _config__WEBPACK_IMPORTED_MODULE_2__.START_CATEGORY;

    this.setTheme(dataTheme);
    this.getFilterProduct(_config__WEBPACK_IMPORTED_MODULE_2__.START_CATEGORY);
  }

  get currentCategory() {
    return this._category;
  }
  getFilterProduct(category) {
    this._category = category;
    this._currentPage = 0;

    const fp = this._products.filter(
      (product) => product.category === this._category,
    );

    let result = fp;

    if (this._pageSize && this._pageSize < fp.length) {
      result = fp.slice(this._currentPage, this._currentPage + this._pageSize);
    }

    this._state.currentCategory = {
      data: {
        items: result,
        finish: !this._pageSize || this._pageSize >= fp.length,
      },
    };
    this._currentPage = 1;
  }

  /**
   * @param {number} size
   */
  set pageSize(size) {
    if (this._pageSize === size) return;

    const oldPageSize = this._pageSize;
    this._pageSize = size;

    if (!this._category) return;

    if ((!oldPageSize && size) || (oldPageSize && oldPageSize > size)) {
      this._state.removeCartsToCount = { data: this._pageSize };
      this._currentPage = 1;
    } else if (oldPageSize && !size) {
      this.getNextPage(oldPageSize);
    }
  }

  getNextPage(pageSize = this._pageSize) {
    const fp = this._products.filter(
      (product) => product.category === this._category,
    );
    if (this._pageSize) {
      const newFirst = this._currentPage * pageSize;
      const newFinish = newFirst + pageSize;
      const nextPortion = fp.slice(newFirst, Math.min(newFinish, fp.length));
      this._state.addCarts = {
        data: {
          items: nextPortion,
          finish: fp.length <= newFinish,
        },
      };
      this._currentPage += 1;
    } else {
      const newFirst = this._currentPage * pageSize;
      const newFinish = fp.length;
      const nextPortion = fp.slice(newFirst, Math.min(newFinish, fp.length));
      this._state.addCarts = {
        data: {
          items: nextPortion,
          finish: fp.length <= newFinish,
        },
      };
      this._currentPage = 1;
    }
  }

  getModal(id) {
    const cleanId = Number(id.replace(/[^\d]/g, ""));

    this._currentCart = this._products.find(
      (product) =>
        product.category === this._category && Number(product.id) == cleanId,
    );
    if (!this._currentCart) {
      console.error(
        `Товар с ID ${cleanId} в категории ${this._category} не найден.`,
      );
      return;
    }
    this._state.modal = { data: this._currentCart };
  }

  setTheme(theme = false) {
    this._state.theme = theme;
    this.dataClient.setItem("theme", theme);
  }

  calcPrice(sizeValue = "S", selectAdditives = []) {
    const totalPrice = this._currentCart.totalPrice(sizeValue, selectAdditives);

    this._state.calcPrice = { data: totalPrice };
  }

  subscribe(reducerFunction) {
    this.listener = reducerFunction;
    this.init().then(() => console.log(""));
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MenuModel);


/***/ },

/***/ "./ModalCartUI.js"
/*!************************!*\
  !*** ./ModalCartUI.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderМоdalCart": () => (/* binding */ renderМоdalCart)
/* harmony export */ });
/* harmony import */ var _ItemUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ItemUI */ "./ItemUI.js");


const $ = _ItemUI__WEBPACK_IMPORTED_MODULE_0__["default"].create;

function renderМоdalCart(targetCart, updatePrice) {
  if (!targetCart) {
    return;
  }

  const modalComponent = $(
    "dialog.modal-cart",
    {
      events: {
        click: (event) => {
          if (event.target === event.currentTarget) {
            modalComponent.destroy();
          }
        },
        cancel: (event) => {
          event.preventDefault();
          modalComponent.destroy();
        },
      },
    },
    [
      $(".modal-img.preview-box", [
        $(".preview-img-wrapper", [
          $("img.cart-img", {
            attrs: {
              src: `images/${targetCart.category}-${targetCart.id}.png`,
              alt: "",
            },
          }),
        ]),
      ]),
      $(".modal-content", [
        $(".content-product-item", [
          $("h2.title", targetCart.name),
          $("p.description-product-item", targetCart.description),
        ]),
        $(".sizes", [
          $("p.sizes-title", "Size"),
          $(
            ".sizes-radio-wrapper",
            {
              events: { change: updatePrice },
            },
            createSizesInputs(targetCart.getSizes),
          ),
        ]),
        $(".additives", [
          $("p.additives-title", "Additives"),
          $(
            ".additives-checkbox-wrapper",
            {
              events: { change: updatePrice },
            },
            createAdditivesInputs(targetCart.additives),
          ),
        ]),
        $(".total-wrapper", [
          $(".total-text", "Total:"),
          $("p.total-price", `${targetCart.price} $`),
        ]),
        $(".alert", [
          $("img.info-img", {
            attrs: { src: "images/info-empty.svg", alt: "" },
          }),
          $(
            "p.alert-info-cost",
            "The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.",
          ),
        ]),
        $("button.button-3.modal-close-button.text-wrapper-7", {
          text: "Close",
          events: {
            click: () => modalComponent.destroy(),
          },
        }),
      ]),
    ],
  );

  return modalComponent.uiElement;
}

function createSizesInputs(sizes = new Map()) {
  let innerInputs = [];
  let index = 0;

  sizes.forEach((value, key) => {
    let isFirst = index === 0;
    const input = $("label.tab-size", {}, [
      $("span.icon.text-wrapper-7", key),
      $("input.size-input", {
        attrs: {
          type: "radio",
          name: "sizes",
          ...(isFirst && { checked: "true" }),
        },
        value: key,
      }),
      $("span.text-wrapper-7", value.size),
    ]);

    innerInputs.push(input);
    index += 1;
  });

  return innerInputs;
}

function createAdditivesInputs(additives = []) {
  let innerInputs = [];

  additives.forEach((additive, i) => {
    const input = $("label.tab-additive", {}, [
      $("span.icon.text-wrapper-7", i + 1),
      $("input.additive-input", {
        attrs: { type: "checkbox", name: "additives" },
        value: additive.name,
      }),
      $("span.text-wrapper-7", additive.name),
    ]);
    innerInputs.push(input);
    i += 1;
  });

  return innerInputs;
}


/***/ },

/***/ "./config.js"
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PAGE_SIZE_768: () => (/* binding */ PAGE_SIZE_768),
/* harmony export */   START_CATEGORY: () => (/* binding */ START_CATEGORY),
/* harmony export */   delay: () => (/* binding */ delay),
/* harmony export */   withLock: () => (/* binding */ withLock)
/* harmony export */ });
const START_CATEGORY = "coffee"; // или "tea", смотря что у вас по дефолту
const PAGE_SIZE_768 = 4;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function withLock(fn, delay = 500) {
  let isLocked = false;

  return function (...args) {
    if (isLocked) return; // Если стоит замок — игнорируем клик

    isLocked = true;
    fn.apply(this, args);

    setTimeout(() => {
      isLocked = false;
    }, delay);
  };
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		const getProto = Object.getPrototypeOf;
/******/ 		let leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			const ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			const def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	__webpack_require__.f = {};
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = (chunkId) => {
/******/ 		return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 			__webpack_require__.f[key](chunkId, promises);
/******/ 			return promises;
/******/ 		}, []));
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	// This function allow to reference async chunks
/******/ 	__webpack_require__.u = (chunkId) => ("js/" + chunkId + "." + "e1a4fe7f0997d390d853" + ".js");
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	// This function allow to reference all chunks
/******/ 	__webpack_require__.miniCssF = (chunkId) => (undefined);
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		const inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			let script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					const s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 		
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			const onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				const doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			const timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		let scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		const document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					let i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^https?:/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:|[?#].*$/g, "").replace(/\/[^/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		const installedChunks = {
/******/ 			"p2": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				let installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							const promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							const error = new Error();
/******/ 							const loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										const errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										const realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										error.event = event;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(__webpack_require__.p + __webpack_require__.u(chunkId), loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		const webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		const chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************!*\
  !*** ./menu.js ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BurgerMenu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BurgerMenu */ "./BurgerMenu.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./config.js");
/* harmony import */ var _MenuModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MenuModel */ "./MenuModel.js");
/* harmony import */ var _ModalCartUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ModalCartUI */ "./ModalCartUI.js");





const mediaQuery = window.matchMedia("(max-width: 768px)");

const lightButton = document.querySelector(".light");
const darkButton = document.querySelector(".dark");
const grid = document.querySelector(".grid");
const itemPreview = grid.querySelector(".preview");
const refreshButton = document.querySelector(".button-refresh");

const burgerButton = document.querySelector(".button-icon-burger");
const burgerAcide = document.querySelector(".burger-nav");

const burgerMenu = new _BurgerMenu__WEBPACK_IMPORTED_MODULE_0__["default"](burgerButton, burgerAcide);

const createImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

const menuModel = new _MenuModel__WEBPACK_IMPORTED_MODULE_2__["default"]();

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
  menuModel.pageSize = _config__WEBPACK_IMPORTED_MODULE_1__.PAGE_SIZE_768;
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
    (0,_config__WEBPACK_IMPORTED_MODULE_1__.withLock)(() => {
      menuModel.getNextPage();
    }, 400),
  );
}

function handleScreenChange(event) {
  if (event.matches) {
    menuModel.pageSize = _config__WEBPACK_IMPORTED_MODULE_1__.PAGE_SIZE_768;
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
  const modalCart = (0,_ModalCartUI__WEBPACK_IMPORTED_MODULE_3__["renderМоdalCart"])(answer.data, updatePrice);
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
    refreshButton.classList.remove("fade-out");
  }

  previews.forEach(async (card) => {
    card.classList.add("fade-out");
    await (0,_config__WEBPACK_IMPORTED_MODULE_1__.delay)(300);
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixnRUFBZTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLHVCQUF1QjtBQUM1RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLDhDQUFLO0FBQ2Y7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vQnVyZ2VyTWVudS5qcyIsIndlYnBhY2s6Ly8vLi9EYXRhQ2xpZW50LmpzIiwid2VicGFjazovLy8uL0l0ZW1VSS5qcyIsIndlYnBhY2s6Ly8vLi9NZW51SXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9NZW51TW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vTW9kYWxDYXJ0VUkuanMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NyZWF0ZSBmYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2Vuc3VyZSBjaHVuayIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZ2V0IG1pbmktY3NzIGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbG9hZCBzY3JpcHQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly8vLi9tZW51LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEJ1cmdlck1lbnUge1xuICBjb25zdHJ1Y3RvcihidXJnZXJCdXR0b24sIGFzaWRlUGFuZWwpIHtcbiAgICB0aGlzLmJ1cmdlckJ1dHRvbiA9IGJ1cmdlckJ1dHRvbjtcbiAgICB0aGlzLmFzaWRlUGFuZWwgPSBhc2lkZVBhbmVsO1xuICAgIHRoaXMubmF2SXRlbXMgPSB0aGlzLmFzaWRlUGFuZWwucXVlcnlTZWxlY3RvckFsbChcIi5saW5rXCIpO1xuICAgIHRoaXMubWVkaWFRdWVyeSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogODcwcHgpXCIpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5vbkNsaWNrQnVyZ2VyQnV0dG9uID0gdGhpcy5oYW5kbGVCdXJnZXJCdXR0b24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmJ1cmdlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrQnVyZ2VyQnV0dG9uKTtcblxuICAgIHRoaXMub25DbGlja05hdkxpbmsgPSB0aGlzLmhhbmRsZVBhbmVsQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmFzaWRlUGFuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja05hdkxpbmspO1xuXG4gICAgdGhpcy5vblNjcmVlbkNoYW5nZUhhbmRsZXIgPSB0aGlzLmhhbmRsZVNjcmVlbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMubWVkaWFRdWVyeS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMub25TY3JlZW5DaGFuZ2VIYW5kbGVyKTtcblxuICAgIHRoaXMub25DYW5jZWxIYW5kbGVyID0gdGhpcy5oYW5kbGVDYW5jZWwuYmluZCh0aGlzKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLm9uQ2FuY2VsSGFuZGxlcik7XG4gIH1cblxuICBoYW5kbGVCdXJnZXJCdXR0b24oKSB7XG4gICAgdGhpcy5hc2lkZVBhbmVsLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XG4gICAgdGhpcy5idXJnZXJCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKTtcblxuICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMuYXNpZGVQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IGlzT3BlbiA/IFwiaGlkZGVuXCIgOiBcIlwiO1xuICB9XG5cbiAgaGFuZGxlU2NyZWVuQ2hhbmdlKGV2ZW50KSB7XG4gICAgaWYgKCFldmVudC5tYXRjaGVzKSB7XG4gICAgICB0aGlzLmFzaWRlUGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIHRoaXMuYnVyZ2VyQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJcIjtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVQYW5lbENsaWNrKGV2ZW50KSB7XG4gICAgY29uc3QgY2xpY2tlZExpbmsgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi5saW5rXCIpO1xuICAgIGlmICghY2xpY2tlZExpbmspIHJldHVybjtcbiAgICB0aGlzLmhhbmRsZUJ1cmdlckJ1dHRvbigpO1xuICB9XG5cbiAgaGFuZGxlQ2FuY2VsKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleSAhPT0gXCJFc2NhcGVcIikgcmV0dXJuO1xuICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMuYXNpZGVQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5oYW5kbGVCdXJnZXJCdXR0b24oKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuYnVyZ2VyQnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tCdXJnZXJCdXR0b24pO1xuICAgIHRoaXMuYXNpZGVQYW5lbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrTmF2TGluayk7XG4gICAgdGhpcy5tZWRpYVF1ZXJ5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5vblNjcmVlbkNoYW5nZUhhbmRsZXIpO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcIlwiO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1cmdlck1lbnU7XG4iLCJcclxuY2xhc3MgRGF0YUNsaWVudCB7XHJcbiAgY29uc3RydWN0b3IobmFtZXNwYWNlID0gXCJjb2ZmZWUtaG91c2VcIikge1xyXG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRJdGVtKGtleSA9ICcnKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMubmFtZXNwYWNlfToke2tleX1gKTtcclxuICAgIHJldHVybiB2YWx1ZSA/IEpTT04ucGFyc2UodmFsdWUpIDogbnVsbDtcclxuICB9XHJcblxyXG4gIHNldEl0ZW0oa2V5ID0gJycsIHZhbHVlID0gdW5kZWZpbmVkKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLm5hbWVzcGFjZX06JHtrZXl9YCwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUl0ZW0oa2V5ID0gJycpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGAke3RoaXMubmFtZXNwYWNlfToke2tleX1gKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGFDbGllbnRcclxuIiwiY2xhc3MgSXRlbVVJIHtcbiAgY29uc3RydWN0b3Ioe1xuICAgIHRhZyA9IFwiZGl2XCIsXG4gICAgY2xhc3NOYW1lcyA9IFtdLFxuICAgIGlubmVycyA9IFtdLFxuICAgIHRleHQgPSB1bmRlZmluZWQsXG4gICAgdmFsdWUgPSB1bmRlZmluZWQsXG4gICAgYXR0cnMgPSB7fSxcbiAgICBldmVudHMgPSB7fSxcbiAgfSA9IHt9KSB7XG4gICAgdGhpcy50YWcgPSB0YWc7XG4gICAgdGhpcy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcbiAgICB0aGlzLmlubmVycyA9IGlubmVycztcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmF0dHJzID0gYXR0cnM7XG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgdGhpcy51aUVsZW1lbnQgPSB0aGlzLmNyZWF0ZU15RWxlbWVudCgpO1xuICB9XG5cbiAgY3JlYXRlTXlFbGVtZW50KCkge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnRhZyk7XG5cbiAgICB0aGlzLmNsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnRleHQpIHtcbiAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy50ZXh0O1xuICAgIH1cblxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuYXR0cnMpLmZvckVhY2goKFtrLCB2XSkgPT4gZWxlbWVudC5zZXRBdHRyaWJ1dGUoaywgdikpO1xuXG4gICAgaWYgKHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZWxlbWVudC52YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5ldmVudHMpLmZvckVhY2goKFtldmVudE5hbWUsIGhhbmRsZXJdKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuaW5uZXJzLmZvckVhY2goKGlubmVyRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGlubmVyRWxlbWVudCBpbnN0YW5jZW9mIEl0ZW1VSSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGlubmVyRWxlbWVudC51aUVsZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmIChpbm5lckVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGlubmVyRWxlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5pbm5lcnMuZm9yRWFjaCgoaW5uZXIpID0+IHtcbiAgICAgIGlmIChpbm5lciBpbnN0YW5jZW9mIEl0ZW1VSSkge1xuICAgICAgICBpbm5lci5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy51aUVsZW1lbnQgJiYgdGhpcy51aUVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy51aUVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy51aUVsZW1lbnQgPSBudWxsO1xuICAgIHRoaXMuaW5uZXJzID0gW107XG4gICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUodGFnQW5kQ2xhc3NlcywgY29uZmlnT3JJbm5lcnMgPSB7fSwgcG9zc2libGVJbm5lcnMgPSBbXSkge1xuICAgIGxldCB0YXJnZXRTdHJpbmcgPSB0YWdBbmRDbGFzc2VzLnRyaW0oKTtcbiAgICBpZiAodGFyZ2V0U3RyaW5nLnN0YXJ0c1dpdGgoXCIuXCIpKSB7XG4gICAgICB0YXJnZXRTdHJpbmcgPSBcImRpdlwiICsgdGFyZ2V0U3RyaW5nO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnRzID0gdGFyZ2V0U3RyaW5nLnNwbGl0KFwiLlwiKTtcbiAgICBjb25zdCB0YWcgPSBwYXJ0c1swXSB8fCBcImRpdlwiO1xuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBwYXJ0cy5zbGljZSgxKTtcblxuICAgIGxldCBjb25maWcgPSB7fTtcbiAgICBsZXQgaW5uZXJzID0gcG9zc2libGVJbm5lcnM7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb25maWdPcklubmVycykpIHtcbiAgICAgIGlubmVycyA9IGNvbmZpZ09ySW5uZXJzO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0eXBlb2YgY29uZmlnT3JJbm5lcnMgPT09IFwic3RyaW5nXCIgfHxcbiAgICAgIHR5cGVvZiBjb25maWdPcklubmVycyA9PT0gXCJudW1iZXJcIlxuICAgICkge1xuICAgICAgY29uZmlnLnRleHQgPSBjb25maWdPcklubmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnID0geyAuLi5jb25maWdPcklubmVycyB9O1xuICAgIH1cblxuICAgIGlmIChpbm5lcnMubGVuZ3RoID4gMCkgY29uZmlnLmlubmVycyA9IGlubmVycztcbiAgICBjb25maWcudGFnID0gdGFnO1xuICAgIGNvbmZpZy5jbGFzc05hbWVzID0gWy4uLmNsYXNzTmFtZXMsIC4uLihjb25maWcuY2xhc3NOYW1lcyB8fCBbXSldO1xuXG4gICAgcmV0dXJuIG5ldyBJdGVtVUkoY29uZmlnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJdGVtVUk7XG4iLCJjbGFzcyBNZW51SXRlbSB7XG4gIGNvbnN0cnVjdG9yKHsgaWQsIG5hbWUsIGRlc2NyaXB0aW9uLCBwcmljZSwgY2F0ZWdvcnksIHNpemVzLCBhZGRpdGl2ZXMgfSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnByaWNlID0gcHJpY2U7XG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgIHRoaXMuc2l6ZXMgPSBzaXplcztcbiAgICB0aGlzLmFkZGl0aXZlcyA9IGFkZGl0aXZlcztcblxuICAgIHRoaXMuX3NpemVNYXAgPSBuZXcgTWFwKFxuICAgICAgT2JqZWN0LmVudHJpZXMoc2l6ZXMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBbXG4gICAgICAgIGtleS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICB7XG4gICAgICAgICAgc2l6ZTogdmFsdWUuc2l6ZSxcbiAgICAgICAgICBhZGRQcmljZTogcGFyc2VGbG9hdCh2YWx1ZVtcImFkZC1wcmljZVwiXSksXG4gICAgICAgIH0sXG4gICAgICBdKSxcbiAgICApO1xuICB9XG5cbiAgZ2V0IGdldFNpemVzKCkge1xuICAgIHJldHVybiB0aGlzLl9zaXplTWFwO1xuICB9XG5cbiAgdG90YWxQcmljZShzaXplLCBhZGRpdGl2ZXMgPSBbXSkge1xuICAgIGxldCBmaW5hbFByaWNlID0gcGFyc2VGbG9hdCh0aGlzLnByaWNlKTtcbiAgICBjb25zdCBhY3RpdmVTaXplS2V5ID0gc2l6ZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgaWYgKHRoaXMuX3NpemVNYXAuaGFzKGFjdGl2ZVNpemVLZXkpKSB7XG4gICAgICBmaW5hbFByaWNlICs9IHRoaXMuX3NpemVNYXAuZ2V0KGFjdGl2ZVNpemVLZXkpLmFkZFByaWNlO1xuICAgIH1cblxuICAgIGFkZGl0aXZlcy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBhY3RpdmVBZGRpdGl2ZSA9IHRoaXMuYWRkaXRpdmVzLmZpbmQoXG4gICAgICAgIChhZGRpdGl2ZSkgPT4gYWRkaXRpdmUubmFtZSA9PT0gbmFtZSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChhY3RpdmVBZGRpdGl2ZSAmJiBhY3RpdmVBZGRpdGl2ZVtcImFkZC1wcmljZVwiXSkge1xuICAgICAgICBmaW5hbFByaWNlICs9IHBhcnNlRmxvYXQoYWN0aXZlQWRkaXRpdmVbXCJhZGQtcHJpY2VcIl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaW5hbFByaWNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lbnVJdGVtO1xuIiwiaW1wb3J0IERhdGFDbGllbnQgZnJvbSBcIi4vRGF0YUNsaWVudFwiO1xuaW1wb3J0IE1lbnVJdGVtIGZyb20gXCIuL01lbnVJdGVtXCI7XG5cbmltcG9ydCB7IFNUQVJUX0NBVEVHT1JZIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5cbmNsYXNzIE1lbnVNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Byb2R1Y3RzID0gW107XG4gICAgdGhpcy5fY2F0ZWdvcnkgPSBcIlwiO1xuICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gMDtcbiAgICB0aGlzLl9wYWdlU2l6ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9jdXJyZW50Q2FydCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl90aGVtZSA9IGZhbHNlO1xuICAgIHRoaXMuZGF0YUNsaWVudCA9IG5ldyBEYXRhQ2xpZW50KCk7XG5cbiAgICBjb25zdCBkZWZhdWx0U3RhdGUgPSB7XG4gICAgICBjdXJyZW50Q2F0ZWdvcnk6IFtdLFxuICAgICAgYWRkQ2FydHM6IFtdLFxuICAgICAgbW9kYWw6IG51bGwsXG4gICAgICB0aGVtZTogZmFsc2UsXG4gICAgICBjYWxjUHJpY2U6IDAsXG4gICAgICByZW1vdmVDYXJ0c1RvQ291bnQ6IDAsXG4gICAgfTtcblxuICAgIHRoaXMuX3N0YXRlID0gbmV3IFByb3h5KGRlZmF1bHRTdGF0ZSwge1xuICAgICAgc2V0OiAodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHRhcmdldFtwcm9wZXJ0eV0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVyKSB7XG4gICAgICAgICAgdGhpcy5saXN0ZW5lcihwcm9wZXJ0eSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICBjb25zdCBkYXRhVGhlbWUgPSBhd2FpdCB0aGlzLmRhdGFDbGllbnQuZ2V0SXRlbShcInRoZW1lXCIpO1xuXG4gICAgY29uc3QgcHJvZHVjdHNNb2R1bGUgPSBhd2FpdCBpbXBvcnQoXCIuL2ltYWdlcy9wcm9kdWN0cy5qc29uXCIsIHtcbiAgICAgIHdpdGg6IHsgdHlwZTogXCJqc29uXCIgfSxcbiAgICB9KTtcbiAgICB0aGlzLl9wcm9kdWN0cyA9IHByb2R1Y3RzTW9kdWxlLmRlZmF1bHQubWFwKChpdGVtKSA9PiBuZXcgTWVudUl0ZW0oaXRlbSkpO1xuXG4gICAgdGhpcy5fY2F0ZWdvcnkgPSBTVEFSVF9DQVRFR09SWTtcblxuICAgIHRoaXMuc2V0VGhlbWUoZGF0YVRoZW1lKTtcbiAgICB0aGlzLmdldEZpbHRlclByb2R1Y3QoU1RBUlRfQ0FURUdPUlkpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRDYXRlZ29yeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2F0ZWdvcnk7XG4gIH1cbiAgZ2V0RmlsdGVyUHJvZHVjdChjYXRlZ29yeSkge1xuICAgIHRoaXMuX2NhdGVnb3J5ID0gY2F0ZWdvcnk7XG4gICAgdGhpcy5fY3VycmVudFBhZ2UgPSAwO1xuXG4gICAgY29uc3QgZnAgPSB0aGlzLl9wcm9kdWN0cy5maWx0ZXIoXG4gICAgICAocHJvZHVjdCkgPT4gcHJvZHVjdC5jYXRlZ29yeSA9PT0gdGhpcy5fY2F0ZWdvcnksXG4gICAgKTtcblxuICAgIGxldCByZXN1bHQgPSBmcDtcblxuICAgIGlmICh0aGlzLl9wYWdlU2l6ZSAmJiB0aGlzLl9wYWdlU2l6ZSA8IGZwLmxlbmd0aCkge1xuICAgICAgcmVzdWx0ID0gZnAuc2xpY2UodGhpcy5fY3VycmVudFBhZ2UsIHRoaXMuX2N1cnJlbnRQYWdlICsgdGhpcy5fcGFnZVNpemUpO1xuICAgIH1cblxuICAgIHRoaXMuX3N0YXRlLmN1cnJlbnRDYXRlZ29yeSA9IHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgaXRlbXM6IHJlc3VsdCxcbiAgICAgICAgZmluaXNoOiAhdGhpcy5fcGFnZVNpemUgfHwgdGhpcy5fcGFnZVNpemUgPj0gZnAubGVuZ3RoLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxuICAgKi9cbiAgc2V0IHBhZ2VTaXplKHNpemUpIHtcbiAgICBpZiAodGhpcy5fcGFnZVNpemUgPT09IHNpemUpIHJldHVybjtcblxuICAgIGNvbnN0IG9sZFBhZ2VTaXplID0gdGhpcy5fcGFnZVNpemU7XG4gICAgdGhpcy5fcGFnZVNpemUgPSBzaXplO1xuXG4gICAgaWYgKCF0aGlzLl9jYXRlZ29yeSkgcmV0dXJuO1xuXG4gICAgaWYgKCghb2xkUGFnZVNpemUgJiYgc2l6ZSkgfHwgKG9sZFBhZ2VTaXplICYmIG9sZFBhZ2VTaXplID4gc2l6ZSkpIHtcbiAgICAgIHRoaXMuX3N0YXRlLnJlbW92ZUNhcnRzVG9Db3VudCA9IHsgZGF0YTogdGhpcy5fcGFnZVNpemUgfTtcbiAgICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gMTtcbiAgICB9IGVsc2UgaWYgKG9sZFBhZ2VTaXplICYmICFzaXplKSB7XG4gICAgICB0aGlzLmdldE5leHRQYWdlKG9sZFBhZ2VTaXplKTtcbiAgICB9XG4gIH1cblxuICBnZXROZXh0UGFnZShwYWdlU2l6ZSA9IHRoaXMuX3BhZ2VTaXplKSB7XG4gICAgY29uc3QgZnAgPSB0aGlzLl9wcm9kdWN0cy5maWx0ZXIoXG4gICAgICAocHJvZHVjdCkgPT4gcHJvZHVjdC5jYXRlZ29yeSA9PT0gdGhpcy5fY2F0ZWdvcnksXG4gICAgKTtcbiAgICBpZiAodGhpcy5fcGFnZVNpemUpIHtcbiAgICAgIGNvbnN0IG5ld0ZpcnN0ID0gdGhpcy5fY3VycmVudFBhZ2UgKiBwYWdlU2l6ZTtcbiAgICAgIGNvbnN0IG5ld0ZpbmlzaCA9IG5ld0ZpcnN0ICsgcGFnZVNpemU7XG4gICAgICBjb25zdCBuZXh0UG9ydGlvbiA9IGZwLnNsaWNlKG5ld0ZpcnN0LCBNYXRoLm1pbihuZXdGaW5pc2gsIGZwLmxlbmd0aCkpO1xuICAgICAgdGhpcy5fc3RhdGUuYWRkQ2FydHMgPSB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBpdGVtczogbmV4dFBvcnRpb24sXG4gICAgICAgICAgZmluaXNoOiBmcC5sZW5ndGggPD0gbmV3RmluaXNoLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIHRoaXMuX2N1cnJlbnRQYWdlICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG5ld0ZpcnN0ID0gdGhpcy5fY3VycmVudFBhZ2UgKiBwYWdlU2l6ZTtcbiAgICAgIGNvbnN0IG5ld0ZpbmlzaCA9IGZwLmxlbmd0aDtcbiAgICAgIGNvbnN0IG5leHRQb3J0aW9uID0gZnAuc2xpY2UobmV3Rmlyc3QsIE1hdGgubWluKG5ld0ZpbmlzaCwgZnAubGVuZ3RoKSk7XG4gICAgICB0aGlzLl9zdGF0ZS5hZGRDYXJ0cyA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGl0ZW1zOiBuZXh0UG9ydGlvbixcbiAgICAgICAgICBmaW5pc2g6IGZwLmxlbmd0aCA8PSBuZXdGaW5pc2gsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgdGhpcy5fY3VycmVudFBhZ2UgPSAxO1xuICAgIH1cbiAgfVxuXG4gIGdldE1vZGFsKGlkKSB7XG4gICAgY29uc3QgY2xlYW5JZCA9IE51bWJlcihpZC5yZXBsYWNlKC9bXlxcZF0vZywgXCJcIikpO1xuXG4gICAgdGhpcy5fY3VycmVudENhcnQgPSB0aGlzLl9wcm9kdWN0cy5maW5kKFxuICAgICAgKHByb2R1Y3QpID0+XG4gICAgICAgIHByb2R1Y3QuY2F0ZWdvcnkgPT09IHRoaXMuX2NhdGVnb3J5ICYmIE51bWJlcihwcm9kdWN0LmlkKSA9PSBjbGVhbklkLFxuICAgICk7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50Q2FydCkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgYNCi0L7QstCw0YAg0YEgSUQgJHtjbGVhbklkfSDQsiDQutCw0YLQtdCz0L7RgNC40LggJHt0aGlzLl9jYXRlZ29yeX0g0L3QtSDQvdCw0LnQtNC10L0uYCxcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3N0YXRlLm1vZGFsID0geyBkYXRhOiB0aGlzLl9jdXJyZW50Q2FydCB9O1xuICB9XG5cbiAgc2V0VGhlbWUodGhlbWUgPSBmYWxzZSkge1xuICAgIHRoaXMuX3N0YXRlLnRoZW1lID0gdGhlbWU7XG4gICAgdGhpcy5kYXRhQ2xpZW50LnNldEl0ZW0oXCJ0aGVtZVwiLCB0aGVtZSk7XG4gIH1cblxuICBjYWxjUHJpY2Uoc2l6ZVZhbHVlID0gXCJTXCIsIHNlbGVjdEFkZGl0aXZlcyA9IFtdKSB7XG4gICAgY29uc3QgdG90YWxQcmljZSA9IHRoaXMuX2N1cnJlbnRDYXJ0LnRvdGFsUHJpY2Uoc2l6ZVZhbHVlLCBzZWxlY3RBZGRpdGl2ZXMpO1xuXG4gICAgdGhpcy5fc3RhdGUuY2FsY1ByaWNlID0geyBkYXRhOiB0b3RhbFByaWNlIH07XG4gIH1cblxuICBzdWJzY3JpYmUocmVkdWNlckZ1bmN0aW9uKSB7XG4gICAgdGhpcy5saXN0ZW5lciA9IHJlZHVjZXJGdW5jdGlvbjtcbiAgICB0aGlzLmluaXQoKS50aGVuKCgpID0+IGNvbnNvbGUubG9nKFwiXCIpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW51TW9kZWw7XG4iLCJpbXBvcnQgSXRlbVVJIGZyb20gXCIuL0l0ZW1VSVwiO1xuXG5jb25zdCAkID0gSXRlbVVJLmNyZWF0ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlctCc0L5kYWxDYXJ0KHRhcmdldENhcnQsIHVwZGF0ZVByaWNlKSB7XG4gIGlmICghdGFyZ2V0Q2FydCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG1vZGFsQ29tcG9uZW50ID0gJChcbiAgICBcImRpYWxvZy5tb2RhbC1jYXJ0XCIsXG4gICAge1xuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBldmVudC5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgICBtb2RhbENvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjYW5jZWw6IChldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgbW9kYWxDb21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIFtcbiAgICAgICQoXCIubW9kYWwtaW1nLnByZXZpZXctYm94XCIsIFtcbiAgICAgICAgJChcIi5wcmV2aWV3LWltZy13cmFwcGVyXCIsIFtcbiAgICAgICAgICAkKFwiaW1nLmNhcnQtaW1nXCIsIHtcbiAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgIHNyYzogYGltYWdlcy8ke3RhcmdldENhcnQuY2F0ZWdvcnl9LSR7dGFyZ2V0Q2FydC5pZH0ucG5nYCxcbiAgICAgICAgICAgICAgYWx0OiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSksXG4gICAgICBdKSxcbiAgICAgICQoXCIubW9kYWwtY29udGVudFwiLCBbXG4gICAgICAgICQoXCIuY29udGVudC1wcm9kdWN0LWl0ZW1cIiwgW1xuICAgICAgICAgICQoXCJoMi50aXRsZVwiLCB0YXJnZXRDYXJ0Lm5hbWUpLFxuICAgICAgICAgICQoXCJwLmRlc2NyaXB0aW9uLXByb2R1Y3QtaXRlbVwiLCB0YXJnZXRDYXJ0LmRlc2NyaXB0aW9uKSxcbiAgICAgICAgXSksXG4gICAgICAgICQoXCIuc2l6ZXNcIiwgW1xuICAgICAgICAgICQoXCJwLnNpemVzLXRpdGxlXCIsIFwiU2l6ZVwiKSxcbiAgICAgICAgICAkKFxuICAgICAgICAgICAgXCIuc2l6ZXMtcmFkaW8td3JhcHBlclwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBldmVudHM6IHsgY2hhbmdlOiB1cGRhdGVQcmljZSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZVNpemVzSW5wdXRzKHRhcmdldENhcnQuZ2V0U2l6ZXMpLFxuICAgICAgICAgICksXG4gICAgICAgIF0pLFxuICAgICAgICAkKFwiLmFkZGl0aXZlc1wiLCBbXG4gICAgICAgICAgJChcInAuYWRkaXRpdmVzLXRpdGxlXCIsIFwiQWRkaXRpdmVzXCIpLFxuICAgICAgICAgICQoXG4gICAgICAgICAgICBcIi5hZGRpdGl2ZXMtY2hlY2tib3gtd3JhcHBlclwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBldmVudHM6IHsgY2hhbmdlOiB1cGRhdGVQcmljZSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZUFkZGl0aXZlc0lucHV0cyh0YXJnZXRDYXJ0LmFkZGl0aXZlcyksXG4gICAgICAgICAgKSxcbiAgICAgICAgXSksXG4gICAgICAgICQoXCIudG90YWwtd3JhcHBlclwiLCBbXG4gICAgICAgICAgJChcIi50b3RhbC10ZXh0XCIsIFwiVG90YWw6XCIpLFxuICAgICAgICAgICQoXCJwLnRvdGFsLXByaWNlXCIsIGAke3RhcmdldENhcnQucHJpY2V9ICRgKSxcbiAgICAgICAgXSksXG4gICAgICAgICQoXCIuYWxlcnRcIiwgW1xuICAgICAgICAgICQoXCJpbWcuaW5mby1pbWdcIiwge1xuICAgICAgICAgICAgYXR0cnM6IHsgc3JjOiBcImltYWdlcy9pbmZvLWVtcHR5LnN2Z1wiLCBhbHQ6IFwiXCIgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICAkKFxuICAgICAgICAgICAgXCJwLmFsZXJ0LWluZm8tY29zdFwiLFxuICAgICAgICAgICAgXCJUaGUgY29zdCBpcyBub3QgZmluYWwuIERvd25sb2FkIG91ciBtb2JpbGUgYXBwIHRvIHNlZSB0aGUgZmluYWwgcHJpY2UgYW5kIHBsYWNlIHlvdXIgb3JkZXIuIEVhcm4gbG95YWx0eSBwb2ludHMgYW5kIGVuam95IHlvdXIgZmF2b3JpdGUgY29mZmVlIHdpdGggdXAgdG8gMjAlIGRpc2NvdW50LlwiLFxuICAgICAgICAgICksXG4gICAgICAgIF0pLFxuICAgICAgICAkKFwiYnV0dG9uLmJ1dHRvbi0zLm1vZGFsLWNsb3NlLWJ1dHRvbi50ZXh0LXdyYXBwZXItN1wiLCB7XG4gICAgICAgICAgdGV4dDogXCJDbG9zZVwiLFxuICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgY2xpY2s6ICgpID0+IG1vZGFsQ29tcG9uZW50LmRlc3Ryb3koKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0pLFxuICAgIF0sXG4gICk7XG5cbiAgcmV0dXJuIG1vZGFsQ29tcG9uZW50LnVpRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2l6ZXNJbnB1dHMoc2l6ZXMgPSBuZXcgTWFwKCkpIHtcbiAgbGV0IGlubmVySW5wdXRzID0gW107XG4gIGxldCBpbmRleCA9IDA7XG5cbiAgc2l6ZXMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgIGxldCBpc0ZpcnN0ID0gaW5kZXggPT09IDA7XG4gICAgY29uc3QgaW5wdXQgPSAkKFwibGFiZWwudGFiLXNpemVcIiwge30sIFtcbiAgICAgICQoXCJzcGFuLmljb24udGV4dC13cmFwcGVyLTdcIiwga2V5KSxcbiAgICAgICQoXCJpbnB1dC5zaXplLWlucHV0XCIsIHtcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICB0eXBlOiBcInJhZGlvXCIsXG4gICAgICAgICAgbmFtZTogXCJzaXplc1wiLFxuICAgICAgICAgIC4uLihpc0ZpcnN0ICYmIHsgY2hlY2tlZDogXCJ0cnVlXCIgfSksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlOiBrZXksXG4gICAgICB9KSxcbiAgICAgICQoXCJzcGFuLnRleHQtd3JhcHBlci03XCIsIHZhbHVlLnNpemUpLFxuICAgIF0pO1xuXG4gICAgaW5uZXJJbnB1dHMucHVzaChpbnB1dCk7XG4gICAgaW5kZXggKz0gMTtcbiAgfSk7XG5cbiAgcmV0dXJuIGlubmVySW5wdXRzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBZGRpdGl2ZXNJbnB1dHMoYWRkaXRpdmVzID0gW10pIHtcbiAgbGV0IGlubmVySW5wdXRzID0gW107XG5cbiAgYWRkaXRpdmVzLmZvckVhY2goKGFkZGl0aXZlLCBpKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSAkKFwibGFiZWwudGFiLWFkZGl0aXZlXCIsIHt9LCBbXG4gICAgICAkKFwic3Bhbi5pY29uLnRleHQtd3JhcHBlci03XCIsIGkgKyAxKSxcbiAgICAgICQoXCJpbnB1dC5hZGRpdGl2ZS1pbnB1dFwiLCB7XG4gICAgICAgIGF0dHJzOiB7IHR5cGU6IFwiY2hlY2tib3hcIiwgbmFtZTogXCJhZGRpdGl2ZXNcIiB9LFxuICAgICAgICB2YWx1ZTogYWRkaXRpdmUubmFtZSxcbiAgICAgIH0pLFxuICAgICAgJChcInNwYW4udGV4dC13cmFwcGVyLTdcIiwgYWRkaXRpdmUubmFtZSksXG4gICAgXSk7XG4gICAgaW5uZXJJbnB1dHMucHVzaChpbnB1dCk7XG4gICAgaSArPSAxO1xuICB9KTtcblxuICByZXR1cm4gaW5uZXJJbnB1dHM7XG59XG4iLCJleHBvcnQgY29uc3QgU1RBUlRfQ0FURUdPUlkgPSBcImNvZmZlZVwiOyAvLyDQuNC70LggXCJ0ZWFcIiwg0YHQvNC+0YLRgNGPINGH0YLQviDRgyDQstCw0YEg0L/QviDQtNC10YTQvtC70YLRg1xuZXhwb3J0IGNvbnN0IFBBR0VfU0laRV83NjggPSA0O1xuXG5leHBvcnQgY29uc3QgZGVsYXkgPSAobXMpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoTG9jayhmbiwgZGVsYXkgPSA1MDApIHtcbiAgbGV0IGlzTG9ja2VkID0gZmFsc2U7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgaWYgKGlzTG9ja2VkKSByZXR1cm47IC8vINCV0YHQu9C4INGB0YLQvtC40YIg0LfQsNC80L7QuiDigJQg0LjQs9C90L7RgNC40YDRg9C10Lwg0LrQu9C40LpcblxuICAgIGlzTG9ja2VkID0gdHJ1ZTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaXNMb2NrZWQgPSBmYWxzZTtcbiAgICB9LCBkZWxheSk7XG4gIH07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG5jb25zdCBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGNvbnN0IGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHRjb25zdCBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0Y29uc3QgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJjb25zdCBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbmxldCBsZWFmUHJvdG90eXBlcztcbi8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuLy8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4vLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbi8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuLy8gbW9kZSAmIDE2OiByZXR1cm4gdmFsdWUgd2hlbiBpdCdzIFByb21pc2UtbGlrZVxuLy8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuX193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcblx0aWYobW9kZSAmIDEpIHZhbHVlID0gdGhpcyh2YWx1ZSk7XG5cdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG5cdGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcblx0XHRpZigobW9kZSAmIDQpICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcblx0XHRpZigobW9kZSAmIDE2KSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHZhbHVlO1xuXHR9XG5cdGNvbnN0IG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcblx0Y29uc3QgZGVmID0ge307XG5cdGxlYWZQcm90b3R5cGVzID0gbGVhZlByb3RvdHlwZXMgfHwgW251bGwsIGdldFByb3RvKHt9KSwgZ2V0UHJvdG8oW10pLCBnZXRQcm90byhnZXRQcm90byldO1xuXHRmb3IodmFyIGN1cnJlbnQgPSBtb2RlICYgMiAmJiB2YWx1ZTsgKHR5cGVvZiBjdXJyZW50ID09ICdvYmplY3QnIHx8IHR5cGVvZiBjdXJyZW50ID09ICdmdW5jdGlvbicpICYmICF+bGVhZlByb3RvdHlwZXMuaW5kZXhPZihjdXJyZW50KTsgY3VycmVudCA9IGdldFByb3RvKGN1cnJlbnQpKSB7XG5cdFx0T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY3VycmVudCkuZm9yRWFjaCgoa2V5KSA9PiAoZGVmW2tleV0gPSAoKSA9PiAodmFsdWVba2V5XSkpKTtcblx0fVxuXHRkZWZbJ2RlZmF1bHQnXSA9ICgpID0+ICh2YWx1ZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChucywgZGVmKTtcblx0cmV0dXJuIG5zO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmYgPSB7fTtcbi8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbi8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKGNodW5rSWQpID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uZikucmVkdWNlKChwcm9taXNlcywga2V5KSA9PiB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mW2tleV0oY2h1bmtJZCwgcHJvbWlzZXMpO1xuXHRcdHJldHVybiBwcm9taXNlcztcblx0fSwgW10pKTtcbn07IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYXN5bmMgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnUgPSAoY2h1bmtJZCkgPT4gKFwianMvXCIgKyBjaHVua0lkICsgXCIuXCIgKyBcImUxYTRmZTdmMDk5N2QzOTBkODUzXCIgKyBcIi5qc1wiKTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhbGwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm1pbmlDc3NGID0gKGNodW5rSWQpID0+ICh1bmRlZmluZWQpOyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKTsiLCJjb25zdCBpblByb2dyZXNzID0ge307XG4vLyBkYXRhLXdlYnBhY2sgaXMgbm90IHVzZWQgYXMgYnVpbGQgaGFzIG5vIHVuaXF1ZU5hbWVcbi8vIGxvYWRTY3JpcHQgZnVuY3Rpb24gdG8gbG9hZCBhIHNjcmlwdCB2aWEgc2NyaXB0IHRhZ1xuX193ZWJwYWNrX3JlcXVpcmVfXy5sID0gKHVybCwgZG9uZSwga2V5LCBjaHVua0lkKSA9PiB7XG5cdGlmKGluUHJvZ3Jlc3NbdXJsXSkgeyBpblByb2dyZXNzW3VybF0ucHVzaChkb25lKTsgcmV0dXJuOyB9XG5cdGxldCBzY3JpcHQsIG5lZWRBdHRhY2g7XG5cdGlmKGtleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0Y29uc3Qgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzY3JpcHRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBzID0gc2NyaXB0c1tpXTtcblx0XHRcdGlmKHMuZ2V0QXR0cmlidXRlKFwic3JjXCIpID09IHVybCkgeyBzY3JpcHQgPSBzOyBicmVhazsgfVxuXHRcdH1cblx0fVxuXHRpZighc2NyaXB0KSB7XG5cdFx0bmVlZEF0dGFjaCA9IHRydWU7XG5cdFx0c2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cblx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG5cdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubmMpIHtcblx0XHRcdHNjcmlwdC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBfX3dlYnBhY2tfcmVxdWlyZV9fLm5jKTtcblx0XHR9XG5cblxuXHRcdHNjcmlwdC5zcmMgPSB1cmw7XG5cdH1cblx0aW5Qcm9ncmVzc1t1cmxdID0gW2RvbmVdO1xuXHRjb25zdCBvblNjcmlwdENvbXBsZXRlID0gKHByZXYsIGV2ZW50KSA9PiB7XG5cdFx0Ly8gYXZvaWQgbWVtIGxlYWtzIGluIElFLlxuXHRcdHNjcmlwdC5vbmVycm9yID0gc2NyaXB0Lm9ubG9hZCA9IG51bGw7XG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdGNvbnN0IGRvbmVGbnMgPSBpblByb2dyZXNzW3VybF07XG5cdFx0ZGVsZXRlIGluUHJvZ3Jlc3NbdXJsXTtcblx0XHRzY3JpcHQucGFyZW50Tm9kZSAmJiBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuXHRcdGRvbmVGbnMgJiYgZG9uZUZucy5mb3JFYWNoKChmbikgPT4gKGZuKGV2ZW50KSkpO1xuXHRcdGlmKHByZXYpIHJldHVybiBwcmV2KGV2ZW50KTtcblx0fVxuXHRjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dChvblNjcmlwdENvbXBsZXRlLmJpbmQobnVsbCwgdW5kZWZpbmVkLCB7IHR5cGU6ICd0aW1lb3V0JywgdGFyZ2V0OiBzY3JpcHQgfSksIDEyMDAwMCk7XG5cdHNjcmlwdC5vbmVycm9yID0gb25TY3JpcHRDb21wbGV0ZS5iaW5kKG51bGwsIHNjcmlwdC5vbmVycm9yKTtcblx0c2NyaXB0Lm9ubG9hZCA9IG9uU2NyaXB0Q29tcGxldGUuYmluZChudWxsLCBzY3JpcHQub25sb2FkKTtcblx0bmVlZEF0dGFjaCAmJiBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59OyIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJsZXQgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xuY29uc3QgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdCAmJiBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnRhZ05hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1NDUklQVCcpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0Y29uc3Qgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHRsZXQgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgKCFzY3JpcHRVcmwgfHwgIS9eaHR0cHM/Oi8udGVzdChzY3JpcHRVcmwpKSkgc2NyaXB0VXJsID0gc2NyaXB0c1tpLS1dLnNyYztcblx0XHR9XG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvXmJsb2I6fFs/I10uKiQvZywgXCJcIikucmVwbGFjZSgvXFwvW14vXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsICsgXCIuLi9cIjsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuY29uc3QgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcInAyXCI6IDBcbn07XG5cbl9fd2VicGFja19yZXF1aXJlX18uZi5qID0gKGNodW5rSWQsIHByb21pc2VzKSA9PiB7XG5cdFx0Ly8gSlNPTlAgY2h1bmsgbG9hZGluZyBmb3IgamF2YXNjcmlwdFxuXHRcdGxldCBpbnN0YWxsZWRDaHVua0RhdGEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSA/IGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA6IHVuZGVmaW5lZDtcblx0XHRpZihpbnN0YWxsZWRDaHVua0RhdGEgIT09IDApIHsgLy8gMCBtZWFucyBcImFscmVhZHkgaW5zdGFsbGVkXCIuXG5cblx0XHRcdC8vIGEgUHJvbWlzZSBtZWFucyBcImN1cnJlbnRseSBsb2FkaW5nXCIuXG5cdFx0XHRpZihpbnN0YWxsZWRDaHVua0RhdGEpIHtcblx0XHRcdFx0cHJvbWlzZXMucHVzaChpbnN0YWxsZWRDaHVua0RhdGFbMl0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYodHJ1ZSkgeyAvLyBhbGwgY2h1bmtzIGhhdmUgSlNcblx0XHRcdFx0XHQvLyBzZXR1cCBQcm9taXNlIGluIGNodW5rIGNhY2hlXG5cdFx0XHRcdFx0Y29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IChpbnN0YWxsZWRDaHVua0RhdGEgPSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbcmVzb2x2ZSwgcmVqZWN0XSkpO1xuXHRcdFx0XHRcdHByb21pc2VzLnB1c2goaW5zdGFsbGVkQ2h1bmtEYXRhWzJdID0gcHJvbWlzZSk7XG5cblx0XHRcdFx0XHQvLyBjcmVhdGUgZXJyb3IgYmVmb3JlIHN0YWNrIHVud291bmQgdG8gZ2V0IHVzZWZ1bCBzdGFja3RyYWNlIGxhdGVyXG5cdFx0XHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoKTtcblx0XHRcdFx0XHRjb25zdCBsb2FkaW5nRW5kZWQgPSAoZXZlbnQpID0+IHtcblx0XHRcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpKSB7XG5cdFx0XHRcdFx0XHRcdGluc3RhbGxlZENodW5rRGF0YSA9IGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcblx0XHRcdFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhICE9PSAwKSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGVycm9yVHlwZSA9IGV2ZW50ICYmIChldmVudC50eXBlID09PSAnbG9hZCcgPyAnbWlzc2luZycgOiBldmVudC50eXBlKTtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCByZWFsU3JjID0gZXZlbnQgJiYgZXZlbnQudGFyZ2V0ICYmIGV2ZW50LnRhcmdldC5zcmM7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IubWVzc2FnZSA9ICdMb2FkaW5nIGNodW5rICcgKyBjaHVua0lkICsgJyBmYWlsZWQuXFxuKCcgKyBlcnJvclR5cGUgKyAnOiAnICsgcmVhbFNyYyArICcpJztcblx0XHRcdFx0XHRcdFx0XHRlcnJvci5uYW1lID0gJ0NodW5rTG9hZEVycm9yJztcblx0XHRcdFx0XHRcdFx0XHRlcnJvci50eXBlID0gZXJyb3JUeXBlO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9yLnJlcXVlc3QgPSByZWFsU3JjO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9yLmV2ZW50ID0gZXZlbnQ7XG5cdFx0XHRcdFx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtEYXRhWzFdKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5sKF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18udShjaHVua0lkKSwgbG9hZGluZ0VuZGVkLCBcImNodW5rLVwiICsgY2h1bmtJZCwgY2h1bmtJZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG59O1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuY29uc3Qgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0bGV0IFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cbn1cblxuY29uc3QgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsImltcG9ydCBCdXJnZXJNZW51IGZyb20gXCIuL0J1cmdlck1lbnVcIjtcbmltcG9ydCB7IGRlbGF5LCBQQUdFX1NJWkVfNzY4LCB3aXRoTG9jayB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IE1lbnVNb2RlbCBmcm9tIFwiLi9NZW51TW9kZWxcIjtcbmltcG9ydCB7IHJlbmRlctCc0L5kYWxDYXJ0IH0gZnJvbSBcIi4vTW9kYWxDYXJ0VUlcIjtcblxuY29uc3QgbWVkaWFRdWVyeSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpO1xuXG5jb25zdCBsaWdodEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlnaHRcIik7XG5jb25zdCBkYXJrQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXJrXCIpO1xuY29uc3QgZ3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ3JpZFwiKTtcbmNvbnN0IGl0ZW1QcmV2aWV3ID0gZ3JpZC5xdWVyeVNlbGVjdG9yKFwiLnByZXZpZXdcIik7XG5jb25zdCByZWZyZXNoQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idXR0b24tcmVmcmVzaFwiKTtcblxuY29uc3QgYnVyZ2VyQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idXR0b24taWNvbi1idXJnZXJcIik7XG5jb25zdCBidXJnZXJBY2lkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnVyZ2VyLW5hdlwiKTtcblxuY29uc3QgYnVyZ2VyTWVudSA9IG5ldyBCdXJnZXJNZW51KGJ1cmdlckJ1dHRvbiwgYnVyZ2VyQWNpZGUpO1xuXG5jb25zdCBjcmVhdGVJbWFnZSA9IChzcmMpID0+XG4gIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgIGltZy5vbmxvYWQgPSAoKSA9PiByZXMoaW1nKTtcbiAgICBpbWcub25lcnJvciA9IHJlajtcbiAgICBpbWcuc3JjID0gc3JjO1xuICB9KTtcblxuY29uc3QgbWVudU1vZGVsID0gbmV3IE1lbnVNb2RlbCgpO1xuXG5jb25zdCB1cGRhdGVQcmljZSA9ICgpID0+IHtcbiAgbGV0IHNlbGVjdEFkZGl0aXZlcyA9IFtdO1xuICBjb25zdCBhZGRpdGl2ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFkZGl0aXZlLWlucHV0OmNoZWNrZWRcIik7XG4gIGFkZGl0aXZlcy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIHNlbGVjdEFkZGl0aXZlcy5wdXNoKGlucHV0LnZhbHVlKTtcbiAgfSk7XG5cbiAgY29uc3Qgc2l6ZVZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaXplLWlucHV0OmNoZWNrZWRcIikudmFsdWU7XG4gIG1lbnVNb2RlbC5jYWxjUHJpY2Uoc2l6ZVZhbHVlLCBzZWxlY3RBZGRpdGl2ZXMpO1xufTtcblxubWVudU1vZGVsLnN1YnNjcmliZShzdGF0ZVJlZHVjZXIpO1xuXG5pZiAobWVkaWFRdWVyeS5tYXRjaGVzKSB7XG4gIG1lbnVNb2RlbC5wYWdlU2l6ZSA9IFBBR0VfU0laRV83Njg7XG59XG5cbmNvbnN0IHRhYnNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhYnNcIik7XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgbWVkaWFRdWVyeS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGhhbmRsZVNjcmVlbkNoYW5nZSk7XG4gIGhhbmRsZVNjcmVlbkNoYW5nZShtZWRpYVF1ZXJ5KTtcblxuICBkYXJrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBtZW51TW9kZWwuc2V0VGhlbWUodHJ1ZSk7XG4gIH0pO1xuXG4gIGxpZ2h0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBtZW51TW9kZWwuc2V0VGhlbWUoKTtcbiAgfSk7XG5cbiAgdGFic0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgY2xpY2tlZFRhYiA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KFwiLnRhYi1pdGVtXCIpO1xuICAgIGlmICghY2xpY2tlZFRhYiB8fCBjbGlja2VkVGFiLmdldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld0NhdGVnb3J5ID0gY2xpY2tlZFRhYi5kYXRhc2V0LmNhdGVnb3J5O1xuICAgIHVwZGF0ZUNhdGVnb3J5KG5ld0NhdGVnb3J5KTtcbiAgICBtZW51TW9kZWwuZ2V0RmlsdGVyUHJvZHVjdChuZXdDYXRlZ29yeSk7XG4gIH0pO1xuXG4gIHJlZnJlc2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBcImNsaWNrXCIsXG4gICAgd2l0aExvY2soKCkgPT4ge1xuICAgICAgbWVudU1vZGVsLmdldE5leHRQYWdlKCk7XG4gICAgfSwgNDAwKSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2NyZWVuQ2hhbmdlKGV2ZW50KSB7XG4gIGlmIChldmVudC5tYXRjaGVzKSB7XG4gICAgbWVudU1vZGVsLnBhZ2VTaXplID0gUEFHRV9TSVpFXzc2ODtcbiAgfSBlbHNlIHtcbiAgICBtZW51TW9kZWwucGFnZVNpemUgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVuZGVySXRlbVByZXZpZXcocHJvZHVjdCwgaXRlbSA9IHVuZGVmaW5lZCkge1xuICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbSA9IGl0ZW1QcmV2aWV3LmNsb25lTm9kZSh0cnVlKTtcbiAgfVxuXG4gIGxldCBpbWcgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoXCIuYm94LXByb2R1Y3QtaXRlbVwiKTtcbiAgbGV0IHRpdGxlID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiLnRpdGxlXCIpO1xuICBsZXQgZGVzY3JpcHRpb24gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb24tcHJvZHVjdC1pdGVtXCIpO1xuICBsZXQgcHJpY2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoXCIucHJpY2VcIik7XG4gIHRpdGxlLnRleHRDb250ZW50ID0gcHJvZHVjdC5uYW1lO1xuICBkZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHByb2R1Y3QuZGVzY3JpcHRpb247XG4gIHByaWNlLnRleHRDb250ZW50ID0gXCIkXCIgKyBwcm9kdWN0LnByaWNlO1xuICBjb25zdCBpbWFnZVNyYyA9IGBpbWFnZXMvJHtwcm9kdWN0LmNhdGVnb3J5fS0ke3Byb2R1Y3QuaWR9LnBuZ2A7XG4gIHRyeSB7XG4gICAgY29uc3QgbmV3SW1nID0gYXdhaXQgY3JlYXRlSW1hZ2UoaW1hZ2VTcmMpO1xuICAgIG5ld0ltZy5jbGFzc0xpc3QuYWRkKFwiYm94LXByb2R1Y3QtaXRlbVwiKTtcbiAgICBpZiAoaW1nKSB7XG4gICAgICBpbWcucmVwbGFjZVdpdGgobmV3SW1nKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcbiAgICAgIGDQndC1INGD0LTQsNC70L7RgdGMINC30LDQs9GA0YPQt9C40YLRjCDQutCw0YDRgtC40L3QutGDINC00LvRjyDRgtC+0LLQsNGA0LAgJHtwcm9kdWN0Lm5hbWV9OmAsXG4gICAgICBlcnJvcixcbiAgICApO1xuICB9XG4gIGl0ZW0uZGF0YXNldC5jYXRlZ29yeSA9IHByb2R1Y3QuY2F0ZWdvcnk7XG4gIGl0ZW0uaWQgPSBgcHJvZHVjdC0wJHtwcm9kdWN0LmlkfWA7XG4gIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcImZhZGUtaW5cIiwgXCJmYWRlLW91dFwiKTtcblxuICBjb25zdCBoYW5kbGVDYXJkQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXRJZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuaWQ7XG4gICAgbWVudU1vZGVsLmdldE1vZGFsKHRhcmdldElkKTtcbiAgfTtcbiAgaXRlbS5vbmNsaWNrID0gaGFuZGxlQ2FyZENsaWNrO1xuXG4gIHJldHVybiBpdGVtO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW5kZXJDYXJ0cyhhbnN3ZXIpIHtcbiAgY29uc3QgZGF0YSA9IGFuc3dlci5kYXRhO1xuICBjb25zdCBwcm9kdWN0cyA9IGRhdGEuaXRlbXM7XG4gIHByb2R1Y3RzLmZvckVhY2goYXN5bmMgZnVuY3Rpb24gKHByb2R1Y3QpIHtcbiAgICBsZXQgbmV3SXRlbSA9IGF3YWl0IHJlbmRlckl0ZW1QcmV2aWV3KHByb2R1Y3QpO1xuICAgIGdyaWQuYXBwZW5kQ2hpbGQobmV3SXRlbSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBuZXdJdGVtLmNsYXNzTGlzdC5hZGQoXCJmYWRlLWluXCIpO1xuICAgIH0sIDUwKTtcbiAgfSk7XG5cbiAgaWYgKGRhdGEuZmluaXNoKSB7XG4gICAgcmVmcmVzaEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZmFkZS1vdXRcIik7XG4gIH0gZWxzZSB7XG4gICAgcmVmcmVzaEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmFkZS1vdXRcIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RhdGVSZWR1Y2VyKGFjdGlvblR5cGUsIHBheWxvYWQpIHtcbiAgc3dpdGNoIChhY3Rpb25UeXBlKSB7XG4gICAgY2FzZSBcImN1cnJlbnRDYXRlZ29yeVwiOlxuICAgICAgdXBkYXRlQ2F0ZWdvcnlMYXlvdXQocGF5bG9hZCkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcInJlbW92ZUNhcnRzVG9Db3VudFwiOlxuICAgICAgcmVtb3ZlQ2FydHMocGF5bG9hZCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJhZGRDYXJ0c1wiOlxuICAgICAgcmVuZGVyQ2FydHMocGF5bG9hZCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJ0aGVtZVwiOlxuICAgICAgc3dpdGNoVGhlbWUocGF5bG9hZCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJtb2RhbFwiOlxuICAgICAgcmVuZGVy0JzQvmRhbChwYXlsb2FkKS5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVycikpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiY2FsY1ByaWNlXCI6XG4gICAgICB1cGRhdGVQcmljZU9uU2NyZWVuKHBheWxvYWQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgY29uc29sZS5sb2coYNCh0L7QsdGL0YLQuNC1ICR7YWN0aW9uVHlwZX0g0L3QtSDQstC70LjRj9C10YIg0L3QsCBET00g0Y3RgtC+0Lkg0YHRgtGA0LDQvdC40YbRi2ApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN3aXRjaFRoZW1lKGRhdGFUaGVtZSkge1xuICBpZiAoZGF0YVRoZW1lKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJkYXJrXCIpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlctCc0L5kYWwoYW5zd2VyKSB7XG4gIGNvbnN0IG1vZGFsQ2FydCA9IHJlbmRlctCc0L5kYWxDYXJ0KGFuc3dlci5kYXRhLCB1cGRhdGVQcmljZSk7XG4gIGlmIChtb2RhbENhcnQgaW5zdGFuY2VvZiBIVE1MRGlhbG9nRWxlbWVudCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZC1tZW51XCIpLmFwcGVuZENoaWxkKG1vZGFsQ2FydCk7XG4gICAgbW9kYWxDYXJ0LnNob3dNb2RhbCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVByaWNlT25TY3JlZW4oYW5zd2VyKSB7XG4gIGNvbnN0IGZpbmFsUHJpY2UgPSBhbnN3ZXIuZGF0YTtcbiAgY29uc3QgdG90YWxQcmljZUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLXByaWNlXCIpO1xuICBpZiAoIXRvdGFsUHJpY2VFbGVtZW50KSByZXR1cm47XG4gIHRvdGFsUHJpY2VFbGVtZW50LnRleHRDb250ZW50ID0gYCR7ZmluYWxQcmljZS50b0ZpeGVkKDIpfSAkYDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ2F0ZWdvcnlMYXlvdXQoYW5zd2VyKSB7XG4gIGNvbnN0IGNoZWNrZWRDYXRlZ29yeSA9IHRhYnNDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICBcIi50YWItaXRlbVthcmlhLXNlbGVjdGVkPSd0cnVlJ11cIixcbiAgKS5kYXRhc2V0LmNhdGVnb3J5O1xuICBjb25zdCBjdXJyZW50Q2F0ZWdvcnkgPSBtZW51TW9kZWwuY3VycmVudENhdGVnb3J5O1xuICBpZiAoY2hlY2tlZENhdGVnb3J5ICE9PSBjdXJyZW50Q2F0ZWdvcnkpIHtcbiAgICB1cGRhdGVDYXRlZ29yeShjdXJyZW50Q2F0ZWdvcnkpO1xuICB9XG4gIHJlbW92ZUNhcnRzKCk7XG4gIGF3YWl0IHJlbmRlckNhcnRzKGFuc3dlcik7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNhcnRzKGFuc3dlciA9IHVuZGVmaW5lZCkge1xuICBjb25zdCBwcmV2aWV3c0xpc3QgPSBncmlkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucHJldmlld1wiKTtcbiAgbGV0IHByZXZpZXdzID0gWy4uLnByZXZpZXdzTGlzdF07XG5cbiAgcHJldmlld3MucmV2ZXJzZSgpO1xuICBpZiAoYW5zd2VyKSB7XG4gICAgcHJldmlld3Muc3BsaWNlKGFuc3dlci5kYXRhICogLTEpO1xuICAgIHJlZnJlc2hCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImZhZGUtb3V0XCIpO1xuICB9XG5cbiAgcHJldmlld3MuZm9yRWFjaChhc3luYyAoY2FyZCkgPT4ge1xuICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcImZhZGUtb3V0XCIpO1xuICAgIGF3YWl0IGRlbGF5KDMwMCk7XG4gICAgY2FyZC5yZW1vdmUoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNhdGVnb3J5KGNhdGVnb3J5KSB7XG4gIGNvbnN0IGFsbFRhYnMgPSB0YWJzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGFiLWl0ZW1cIik7XG4gIGFsbFRhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgaWYgKHRhYi5kYXRhc2V0LmNhdGVnb3J5ID09PSBjYXRlZ29yeSkge1xuICAgICAgdGFiLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgXCJ0cnVlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBcImZhbHNlXCIpO1xuICAgIH1cbiAgfSk7XG59XG5cbnJlbmRlcigpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9