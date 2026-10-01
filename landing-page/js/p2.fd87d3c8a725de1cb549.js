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
      //      $(".modal-wr", [
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
      //      ]),
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
    if (previews.length > 0) {
      refreshButton.classList.remove("fade-out");
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLGdFQUFlO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsdUJBQXVCO0FBQzVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLDhDQUFLO0FBQ2Y7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vQnVyZ2VyTWVudS5qcyIsIndlYnBhY2s6Ly8vLi9EYXRhQ2xpZW50LmpzIiwid2VicGFjazovLy8uL0l0ZW1VSS5qcyIsIndlYnBhY2s6Ly8vLi9NZW51SXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9NZW51TW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vTW9kYWxDYXJ0VUkuanMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2NyZWF0ZSBmYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2Vuc3VyZSBjaHVuayIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZ2V0IG1pbmktY3NzIGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbG9hZCBzY3JpcHQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly8vLi9tZW51LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEJ1cmdlck1lbnUge1xuICBjb25zdHJ1Y3RvcihidXJnZXJCdXR0b24sIGFzaWRlUGFuZWwpIHtcbiAgICB0aGlzLmJ1cmdlckJ1dHRvbiA9IGJ1cmdlckJ1dHRvbjtcbiAgICB0aGlzLmFzaWRlUGFuZWwgPSBhc2lkZVBhbmVsO1xuICAgIHRoaXMubmF2SXRlbXMgPSB0aGlzLmFzaWRlUGFuZWwucXVlcnlTZWxlY3RvckFsbChcIi5saW5rXCIpO1xuICAgIHRoaXMubWVkaWFRdWVyeSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogODcwcHgpXCIpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5vbkNsaWNrQnVyZ2VyQnV0dG9uID0gdGhpcy5oYW5kbGVCdXJnZXJCdXR0b24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmJ1cmdlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrQnVyZ2VyQnV0dG9uKTtcblxuICAgIHRoaXMub25DbGlja05hdkxpbmsgPSB0aGlzLmhhbmRsZVBhbmVsQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmFzaWRlUGFuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja05hdkxpbmspO1xuXG4gICAgdGhpcy5vblNjcmVlbkNoYW5nZUhhbmRsZXIgPSB0aGlzLmhhbmRsZVNjcmVlbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMubWVkaWFRdWVyeS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMub25TY3JlZW5DaGFuZ2VIYW5kbGVyKTtcblxuICAgIHRoaXMub25DYW5jZWxIYW5kbGVyID0gdGhpcy5oYW5kbGVDYW5jZWwuYmluZCh0aGlzKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLm9uQ2FuY2VsSGFuZGxlcik7XG4gIH1cblxuICBoYW5kbGVCdXJnZXJCdXR0b24oKSB7XG4gICAgdGhpcy5hc2lkZVBhbmVsLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XG4gICAgdGhpcy5idXJnZXJCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKTtcblxuICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMuYXNpZGVQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IGlzT3BlbiA/IFwiaGlkZGVuXCIgOiBcIlwiO1xuICB9XG5cbiAgaGFuZGxlU2NyZWVuQ2hhbmdlKGV2ZW50KSB7XG4gICAgaWYgKCFldmVudC5tYXRjaGVzKSB7XG4gICAgICB0aGlzLmFzaWRlUGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIHRoaXMuYnVyZ2VyQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJcIjtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVQYW5lbENsaWNrKGV2ZW50KSB7XG4gICAgY29uc3QgY2xpY2tlZExpbmsgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi5saW5rXCIpO1xuICAgIGlmICghY2xpY2tlZExpbmspIHJldHVybjtcbiAgICB0aGlzLmhhbmRsZUJ1cmdlckJ1dHRvbigpO1xuICB9XG5cbiAgaGFuZGxlQ2FuY2VsKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleSAhPT0gXCJFc2NhcGVcIikgcmV0dXJuO1xuICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMuYXNpZGVQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5oYW5kbGVCdXJnZXJCdXR0b24oKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuYnVyZ2VyQnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tCdXJnZXJCdXR0b24pO1xuICAgIHRoaXMuYXNpZGVQYW5lbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrTmF2TGluayk7XG4gICAgdGhpcy5tZWRpYVF1ZXJ5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5vblNjcmVlbkNoYW5nZUhhbmRsZXIpO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcIlwiO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1cmdlck1lbnU7XG4iLCJcclxuY2xhc3MgRGF0YUNsaWVudCB7XHJcbiAgY29uc3RydWN0b3IobmFtZXNwYWNlID0gXCJjb2ZmZWUtaG91c2VcIikge1xyXG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRJdGVtKGtleSA9ICcnKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMubmFtZXNwYWNlfToke2tleX1gKTtcclxuICAgIHJldHVybiB2YWx1ZSA/IEpTT04ucGFyc2UodmFsdWUpIDogbnVsbDtcclxuICB9XHJcblxyXG4gIHNldEl0ZW0oa2V5ID0gJycsIHZhbHVlID0gdW5kZWZpbmVkKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLm5hbWVzcGFjZX06JHtrZXl9YCwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUl0ZW0oa2V5ID0gJycpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGAke3RoaXMubmFtZXNwYWNlfToke2tleX1gKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGFDbGllbnRcclxuIiwiY2xhc3MgSXRlbVVJIHtcbiAgY29uc3RydWN0b3Ioe1xuICAgIHRhZyA9IFwiZGl2XCIsXG4gICAgY2xhc3NOYW1lcyA9IFtdLFxuICAgIGlubmVycyA9IFtdLFxuICAgIHRleHQgPSB1bmRlZmluZWQsXG4gICAgdmFsdWUgPSB1bmRlZmluZWQsXG4gICAgYXR0cnMgPSB7fSxcbiAgICBldmVudHMgPSB7fSxcbiAgfSA9IHt9KSB7XG4gICAgdGhpcy50YWcgPSB0YWc7XG4gICAgdGhpcy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcbiAgICB0aGlzLmlubmVycyA9IGlubmVycztcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmF0dHJzID0gYXR0cnM7XG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgdGhpcy51aUVsZW1lbnQgPSB0aGlzLmNyZWF0ZU15RWxlbWVudCgpO1xuICB9XG5cbiAgY3JlYXRlTXlFbGVtZW50KCkge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnRhZyk7XG5cbiAgICB0aGlzLmNsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnRleHQpIHtcbiAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy50ZXh0O1xuICAgIH1cblxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuYXR0cnMpLmZvckVhY2goKFtrLCB2XSkgPT4gZWxlbWVudC5zZXRBdHRyaWJ1dGUoaywgdikpO1xuXG4gICAgaWYgKHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZWxlbWVudC52YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5ldmVudHMpLmZvckVhY2goKFtldmVudE5hbWUsIGhhbmRsZXJdKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuaW5uZXJzLmZvckVhY2goKGlubmVyRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGlubmVyRWxlbWVudCBpbnN0YW5jZW9mIEl0ZW1VSSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGlubmVyRWxlbWVudC51aUVsZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmIChpbm5lckVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGlubmVyRWxlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5pbm5lcnMuZm9yRWFjaCgoaW5uZXIpID0+IHtcbiAgICAgIGlmIChpbm5lciBpbnN0YW5jZW9mIEl0ZW1VSSkge1xuICAgICAgICBpbm5lci5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy51aUVsZW1lbnQgJiYgdGhpcy51aUVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy51aUVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy51aUVsZW1lbnQgPSBudWxsO1xuICAgIHRoaXMuaW5uZXJzID0gW107XG4gICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUodGFnQW5kQ2xhc3NlcywgY29uZmlnT3JJbm5lcnMgPSB7fSwgcG9zc2libGVJbm5lcnMgPSBbXSkge1xuICAgIGxldCB0YXJnZXRTdHJpbmcgPSB0YWdBbmRDbGFzc2VzLnRyaW0oKTtcbiAgICBpZiAodGFyZ2V0U3RyaW5nLnN0YXJ0c1dpdGgoXCIuXCIpKSB7XG4gICAgICB0YXJnZXRTdHJpbmcgPSBcImRpdlwiICsgdGFyZ2V0U3RyaW5nO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnRzID0gdGFyZ2V0U3RyaW5nLnNwbGl0KFwiLlwiKTtcbiAgICBjb25zdCB0YWcgPSBwYXJ0c1swXSB8fCBcImRpdlwiO1xuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBwYXJ0cy5zbGljZSgxKTtcblxuICAgIGxldCBjb25maWcgPSB7fTtcbiAgICBsZXQgaW5uZXJzID0gcG9zc2libGVJbm5lcnM7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb25maWdPcklubmVycykpIHtcbiAgICAgIGlubmVycyA9IGNvbmZpZ09ySW5uZXJzO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0eXBlb2YgY29uZmlnT3JJbm5lcnMgPT09IFwic3RyaW5nXCIgfHxcbiAgICAgIHR5cGVvZiBjb25maWdPcklubmVycyA9PT0gXCJudW1iZXJcIlxuICAgICkge1xuICAgICAgY29uZmlnLnRleHQgPSBjb25maWdPcklubmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnID0geyAuLi5jb25maWdPcklubmVycyB9O1xuICAgIH1cblxuICAgIGlmIChpbm5lcnMubGVuZ3RoID4gMCkgY29uZmlnLmlubmVycyA9IGlubmVycztcbiAgICBjb25maWcudGFnID0gdGFnO1xuICAgIGNvbmZpZy5jbGFzc05hbWVzID0gWy4uLmNsYXNzTmFtZXMsIC4uLihjb25maWcuY2xhc3NOYW1lcyB8fCBbXSldO1xuXG4gICAgcmV0dXJuIG5ldyBJdGVtVUkoY29uZmlnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJdGVtVUk7XG4iLCJjbGFzcyBNZW51SXRlbSB7XG4gIGNvbnN0cnVjdG9yKHsgaWQsIG5hbWUsIGRlc2NyaXB0aW9uLCBwcmljZSwgY2F0ZWdvcnksIHNpemVzLCBhZGRpdGl2ZXMgfSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnByaWNlID0gcHJpY2U7XG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgIHRoaXMuc2l6ZXMgPSBzaXplcztcbiAgICB0aGlzLmFkZGl0aXZlcyA9IGFkZGl0aXZlcztcblxuICAgIHRoaXMuX3NpemVNYXAgPSBuZXcgTWFwKFxuICAgICAgT2JqZWN0LmVudHJpZXMoc2l6ZXMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBbXG4gICAgICAgIGtleS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICB7XG4gICAgICAgICAgc2l6ZTogdmFsdWUuc2l6ZSxcbiAgICAgICAgICBhZGRQcmljZTogcGFyc2VGbG9hdCh2YWx1ZVtcImFkZC1wcmljZVwiXSksXG4gICAgICAgIH0sXG4gICAgICBdKSxcbiAgICApO1xuICB9XG5cbiAgZ2V0IGdldFNpemVzKCkge1xuICAgIHJldHVybiB0aGlzLl9zaXplTWFwO1xuICB9XG5cbiAgdG90YWxQcmljZShzaXplLCBhZGRpdGl2ZXMgPSBbXSkge1xuICAgIGxldCBmaW5hbFByaWNlID0gcGFyc2VGbG9hdCh0aGlzLnByaWNlKTtcbiAgICBjb25zdCBhY3RpdmVTaXplS2V5ID0gc2l6ZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgaWYgKHRoaXMuX3NpemVNYXAuaGFzKGFjdGl2ZVNpemVLZXkpKSB7XG4gICAgICBmaW5hbFByaWNlICs9IHRoaXMuX3NpemVNYXAuZ2V0KGFjdGl2ZVNpemVLZXkpLmFkZFByaWNlO1xuICAgIH1cblxuICAgIGFkZGl0aXZlcy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBhY3RpdmVBZGRpdGl2ZSA9IHRoaXMuYWRkaXRpdmVzLmZpbmQoXG4gICAgICAgIChhZGRpdGl2ZSkgPT4gYWRkaXRpdmUubmFtZSA9PT0gbmFtZSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChhY3RpdmVBZGRpdGl2ZSAmJiBhY3RpdmVBZGRpdGl2ZVtcImFkZC1wcmljZVwiXSkge1xuICAgICAgICBmaW5hbFByaWNlICs9IHBhcnNlRmxvYXQoYWN0aXZlQWRkaXRpdmVbXCJhZGQtcHJpY2VcIl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaW5hbFByaWNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lbnVJdGVtO1xuIiwiaW1wb3J0IERhdGFDbGllbnQgZnJvbSBcIi4vRGF0YUNsaWVudFwiO1xuaW1wb3J0IE1lbnVJdGVtIGZyb20gXCIuL01lbnVJdGVtXCI7XG5cbmltcG9ydCB7IFNUQVJUX0NBVEVHT1JZIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5cbmNsYXNzIE1lbnVNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Byb2R1Y3RzID0gW107XG4gICAgdGhpcy5fY2F0ZWdvcnkgPSBcIlwiO1xuICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gMDtcbiAgICB0aGlzLl9wYWdlU2l6ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9jdXJyZW50Q2FydCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl90aGVtZSA9IGZhbHNlO1xuICAgIHRoaXMuZGF0YUNsaWVudCA9IG5ldyBEYXRhQ2xpZW50KCk7XG5cbiAgICBjb25zdCBkZWZhdWx0U3RhdGUgPSB7XG4gICAgICBjdXJyZW50Q2F0ZWdvcnk6IFtdLFxuICAgICAgYWRkQ2FydHM6IFtdLFxuICAgICAgbW9kYWw6IG51bGwsXG4gICAgICB0aGVtZTogZmFsc2UsXG4gICAgICBjYWxjUHJpY2U6IDAsXG4gICAgICByZW1vdmVDYXJ0c1RvQ291bnQ6IDAsXG4gICAgfTtcblxuICAgIHRoaXMuX3N0YXRlID0gbmV3IFByb3h5KGRlZmF1bHRTdGF0ZSwge1xuICAgICAgc2V0OiAodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHRhcmdldFtwcm9wZXJ0eV0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVyKSB7XG4gICAgICAgICAgdGhpcy5saXN0ZW5lcihwcm9wZXJ0eSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICBjb25zdCBkYXRhVGhlbWUgPSBhd2FpdCB0aGlzLmRhdGFDbGllbnQuZ2V0SXRlbShcInRoZW1lXCIpO1xuXG4gICAgY29uc3QgcHJvZHVjdHNNb2R1bGUgPSBhd2FpdCBpbXBvcnQoXCIuL2ltYWdlcy9wcm9kdWN0cy5qc29uXCIsIHtcbiAgICAgIHdpdGg6IHsgdHlwZTogXCJqc29uXCIgfSxcbiAgICB9KTtcbiAgICB0aGlzLl9wcm9kdWN0cyA9IHByb2R1Y3RzTW9kdWxlLmRlZmF1bHQubWFwKChpdGVtKSA9PiBuZXcgTWVudUl0ZW0oaXRlbSkpO1xuXG4gICAgdGhpcy5fY2F0ZWdvcnkgPSBTVEFSVF9DQVRFR09SWTtcblxuICAgIHRoaXMuc2V0VGhlbWUoZGF0YVRoZW1lKTtcbiAgICB0aGlzLmdldEZpbHRlclByb2R1Y3QoU1RBUlRfQ0FURUdPUlkpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRDYXRlZ29yeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2F0ZWdvcnk7XG4gIH1cblxuICBnZXRGaWx0ZXJQcm9kdWN0KGNhdGVnb3J5KSB7XG4gICAgdGhpcy5fY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgICB0aGlzLl9jdXJyZW50UGFnZSA9IDA7XG5cbiAgICBjb25zdCBmcCA9IHRoaXMuX3Byb2R1Y3RzLmZpbHRlcihcbiAgICAgIChwcm9kdWN0KSA9PiBwcm9kdWN0LmNhdGVnb3J5ID09PSB0aGlzLl9jYXRlZ29yeSxcbiAgICApO1xuXG4gICAgbGV0IHJlc3VsdCA9IGZwO1xuXG4gICAgaWYgKHRoaXMuX3BhZ2VTaXplICYmIHRoaXMuX3BhZ2VTaXplIDwgZnAubGVuZ3RoKSB7XG4gICAgICByZXN1bHQgPSBmcC5zbGljZSh0aGlzLl9jdXJyZW50UGFnZSwgdGhpcy5fY3VycmVudFBhZ2UgKyB0aGlzLl9wYWdlU2l6ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3RhdGUuY3VycmVudENhdGVnb3J5ID0ge1xuICAgICAgZGF0YToge1xuICAgICAgICBpdGVtczogcmVzdWx0LFxuICAgICAgICBmaW5pc2g6ICF0aGlzLl9wYWdlU2l6ZSB8fCB0aGlzLl9wYWdlU2l6ZSA+PSBmcC5sZW5ndGgsXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5fY3VycmVudFBhZ2UgPSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaXplXG4gICAqL1xuICBzZXQgcGFnZVNpemUoc2l6ZSkge1xuICAgIGlmICh0aGlzLl9wYWdlU2l6ZSA9PT0gc2l6ZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgb2xkUGFnZVNpemUgPSB0aGlzLl9wYWdlU2l6ZTtcbiAgICB0aGlzLl9wYWdlU2l6ZSA9IHNpemU7XG5cbiAgICBpZiAoIXRoaXMuX2NhdGVnb3J5KSByZXR1cm47XG5cbiAgICBpZiAoKCFvbGRQYWdlU2l6ZSAmJiBzaXplKSB8fCAob2xkUGFnZVNpemUgJiYgb2xkUGFnZVNpemUgPiBzaXplKSkge1xuICAgICAgdGhpcy5fc3RhdGUucmVtb3ZlQ2FydHNUb0NvdW50ID0geyBkYXRhOiB0aGlzLl9wYWdlU2l6ZSB9O1xuICAgICAgdGhpcy5fY3VycmVudFBhZ2UgPSAxO1xuICAgIH0gZWxzZSBpZiAob2xkUGFnZVNpemUgJiYgIXNpemUpIHtcbiAgICAgIHRoaXMuZ2V0TmV4dFBhZ2Uob2xkUGFnZVNpemUpO1xuICAgIH1cbiAgfVxuXG4gIGdldE5leHRQYWdlKHBhZ2VTaXplID0gdGhpcy5fcGFnZVNpemUpIHtcbiAgICBjb25zdCBmcCA9IHRoaXMuX3Byb2R1Y3RzLmZpbHRlcihcbiAgICAgIChwcm9kdWN0KSA9PiBwcm9kdWN0LmNhdGVnb3J5ID09PSB0aGlzLl9jYXRlZ29yeSxcbiAgICApO1xuICAgIGlmICh0aGlzLl9wYWdlU2l6ZSkge1xuICAgICAgY29uc3QgbmV3Rmlyc3QgPSB0aGlzLl9jdXJyZW50UGFnZSAqIHBhZ2VTaXplO1xuICAgICAgY29uc3QgbmV3RmluaXNoID0gbmV3Rmlyc3QgKyBwYWdlU2l6ZTtcbiAgICAgIGNvbnN0IG5leHRQb3J0aW9uID0gZnAuc2xpY2UobmV3Rmlyc3QsIE1hdGgubWluKG5ld0ZpbmlzaCwgZnAubGVuZ3RoKSk7XG4gICAgICB0aGlzLl9zdGF0ZS5hZGRDYXJ0cyA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGl0ZW1zOiBuZXh0UG9ydGlvbixcbiAgICAgICAgICBmaW5pc2g6IGZwLmxlbmd0aCA8PSBuZXdGaW5pc2gsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgdGhpcy5fY3VycmVudFBhZ2UgKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbmV3Rmlyc3QgPSB0aGlzLl9jdXJyZW50UGFnZSAqIHBhZ2VTaXplO1xuICAgICAgY29uc3QgbmV3RmluaXNoID0gZnAubGVuZ3RoO1xuICAgICAgY29uc3QgbmV4dFBvcnRpb24gPSBmcC5zbGljZShuZXdGaXJzdCwgTWF0aC5taW4obmV3RmluaXNoLCBmcC5sZW5ndGgpKTtcbiAgICAgIHRoaXMuX3N0YXRlLmFkZENhcnRzID0ge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgaXRlbXM6IG5leHRQb3J0aW9uLFxuICAgICAgICAgIGZpbmlzaDogZnAubGVuZ3RoIDw9IG5ld0ZpbmlzaCxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICB0aGlzLl9jdXJyZW50UGFnZSA9IDE7XG4gICAgfVxuICB9XG5cbiAgZ2V0TW9kYWwoaWQpIHtcbiAgICBjb25zdCBjbGVhbklkID0gTnVtYmVyKGlkLnJlcGxhY2UoL1teXFxkXS9nLCBcIlwiKSk7XG5cbiAgICB0aGlzLl9jdXJyZW50Q2FydCA9IHRoaXMuX3Byb2R1Y3RzLmZpbmQoXG4gICAgICAocHJvZHVjdCkgPT5cbiAgICAgICAgcHJvZHVjdC5jYXRlZ29yeSA9PT0gdGhpcy5fY2F0ZWdvcnkgJiYgTnVtYmVyKHByb2R1Y3QuaWQpID09IGNsZWFuSWQsXG4gICAgKTtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRDYXJ0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBg0KLQvtCy0LDRgCDRgSBJRCAke2NsZWFuSWR9INCyINC60LDRgtC10LPQvtGA0LjQuCAke3RoaXMuX2NhdGVnb3J5fSDQvdC1INC90LDQudC00LXQvS5gLFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fc3RhdGUubW9kYWwgPSB7IGRhdGE6IHRoaXMuX2N1cnJlbnRDYXJ0IH07XG4gIH1cblxuICBzZXRUaGVtZSh0aGVtZSA9IGZhbHNlKSB7XG4gICAgdGhpcy5fc3RhdGUudGhlbWUgPSB0aGVtZTtcbiAgICB0aGlzLmRhdGFDbGllbnQuc2V0SXRlbShcInRoZW1lXCIsIHRoZW1lKTtcbiAgfVxuXG4gIGNhbGNQcmljZShzaXplVmFsdWUgPSBcIlNcIiwgc2VsZWN0QWRkaXRpdmVzID0gW10pIHtcbiAgICBjb25zdCB0b3RhbFByaWNlID0gdGhpcy5fY3VycmVudENhcnQudG90YWxQcmljZShzaXplVmFsdWUsIHNlbGVjdEFkZGl0aXZlcyk7XG5cbiAgICB0aGlzLl9zdGF0ZS5jYWxjUHJpY2UgPSB7IGRhdGE6IHRvdGFsUHJpY2UgfTtcbiAgfVxuXG4gIHN1YnNjcmliZShyZWR1Y2VyRnVuY3Rpb24pIHtcbiAgICB0aGlzLmxpc3RlbmVyID0gcmVkdWNlckZ1bmN0aW9uO1xuICAgIHRoaXMuaW5pdCgpLnRoZW4oKCkgPT4gY29uc29sZS5sb2coXCJcIikpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lbnVNb2RlbDtcbiIsImltcG9ydCBJdGVtVUkgZnJvbSBcIi4vSXRlbVVJXCI7XG5cbmNvbnN0ICQgPSBJdGVtVUkuY3JlYXRlO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVy0JzQvmRhbENhcnQodGFyZ2V0Q2FydCwgdXBkYXRlUHJpY2UpIHtcbiAgaWYgKCF0YXJnZXRDYXJ0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbW9kYWxDb21wb25lbnQgPSAkKFxuICAgIFwiZGlhbG9nLm1vZGFsLWNhcnRcIixcbiAgICB7XG4gICAgICBldmVudHM6IHtcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGV2ZW50LmN1cnJlbnRUYXJnZXQpIHtcbiAgICAgICAgICAgIG1vZGFsQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNhbmNlbDogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBtb2RhbENvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgW1xuICAgICAgLy8gICAgICAkKFwiLm1vZGFsLXdyXCIsIFtcbiAgICAgICQoXCIubW9kYWwtaW1nLnByZXZpZXctYm94XCIsIFtcbiAgICAgICAgJChcIi5wcmV2aWV3LWltZy13cmFwcGVyXCIsIFtcbiAgICAgICAgICAkKFwiaW1nLmNhcnQtaW1nXCIsIHtcbiAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgIHNyYzogYGltYWdlcy8ke3RhcmdldENhcnQuY2F0ZWdvcnl9LSR7dGFyZ2V0Q2FydC5pZH0ucG5nYCxcbiAgICAgICAgICAgICAgYWx0OiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSksXG4gICAgICBdKSxcbiAgICAgICQoXCIubW9kYWwtY29udGVudFwiLCBbXG4gICAgICAgICQoXCIuY29udGVudC1wcm9kdWN0LWl0ZW1cIiwgW1xuICAgICAgICAgICQoXCJoMi50aXRsZVwiLCB0YXJnZXRDYXJ0Lm5hbWUpLFxuICAgICAgICAgICQoXCJwLmRlc2NyaXB0aW9uLXByb2R1Y3QtaXRlbVwiLCB0YXJnZXRDYXJ0LmRlc2NyaXB0aW9uKSxcbiAgICAgICAgXSksXG4gICAgICAgICQoXCIuc2l6ZXNcIiwgW1xuICAgICAgICAgICQoXCJwLnNpemVzLXRpdGxlXCIsIFwiU2l6ZVwiKSxcbiAgICAgICAgICAkKFxuICAgICAgICAgICAgXCIuc2l6ZXMtcmFkaW8td3JhcHBlclwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBldmVudHM6IHsgY2hhbmdlOiB1cGRhdGVQcmljZSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZVNpemVzSW5wdXRzKHRhcmdldENhcnQuZ2V0U2l6ZXMpLFxuICAgICAgICAgICksXG4gICAgICAgIF0pLFxuICAgICAgICAkKFwiLmFkZGl0aXZlc1wiLCBbXG4gICAgICAgICAgJChcInAuYWRkaXRpdmVzLXRpdGxlXCIsIFwiQWRkaXRpdmVzXCIpLFxuICAgICAgICAgICQoXG4gICAgICAgICAgICBcIi5hZGRpdGl2ZXMtY2hlY2tib3gtd3JhcHBlclwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBldmVudHM6IHsgY2hhbmdlOiB1cGRhdGVQcmljZSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZUFkZGl0aXZlc0lucHV0cyh0YXJnZXRDYXJ0LmFkZGl0aXZlcyksXG4gICAgICAgICAgKSxcbiAgICAgICAgXSksXG4gICAgICAgICQoXCIudG90YWwtd3JhcHBlclwiLCBbXG4gICAgICAgICAgJChcIi50b3RhbC10ZXh0XCIsIFwiVG90YWw6XCIpLFxuICAgICAgICAgICQoXCJwLnRvdGFsLXByaWNlXCIsIGAke3RhcmdldENhcnQucHJpY2V9ICRgKSxcbiAgICAgICAgXSksXG4gICAgICAgICQoXCIuYWxlcnRcIiwgW1xuICAgICAgICAgICQoXCJpbWcuaW5mby1pbWdcIiwge1xuICAgICAgICAgICAgYXR0cnM6IHsgc3JjOiBcImltYWdlcy9pbmZvLWVtcHR5LnN2Z1wiLCBhbHQ6IFwiXCIgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICAkKFxuICAgICAgICAgICAgXCJwLmFsZXJ0LWluZm8tY29zdFwiLFxuICAgICAgICAgICAgXCJUaGUgY29zdCBpcyBub3QgZmluYWwuIERvd25sb2FkIG91ciBtb2JpbGUgYXBwIHRvIHNlZSB0aGUgZmluYWwgcHJpY2UgYW5kIHBsYWNlIHlvdXIgb3JkZXIuIEVhcm4gbG95YWx0eSBwb2ludHMgYW5kIGVuam95IHlvdXIgZmF2b3JpdGUgY29mZmVlIHdpdGggdXAgdG8gMjAlIGRpc2NvdW50LlwiLFxuICAgICAgICAgICksXG4gICAgICAgIF0pLFxuICAgICAgICAkKFwiYnV0dG9uLmJ1dHRvbi0zLm1vZGFsLWNsb3NlLWJ1dHRvbi50ZXh0LXdyYXBwZXItN1wiLCB7XG4gICAgICAgICAgdGV4dDogXCJDbG9zZVwiLFxuICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgY2xpY2s6ICgpID0+IG1vZGFsQ29tcG9uZW50LmRlc3Ryb3koKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0pLFxuICAgICAgLy8gICAgICBdKSxcbiAgICBdLFxuICApO1xuXG4gIHJldHVybiBtb2RhbENvbXBvbmVudC51aUVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpemVzSW5wdXRzKHNpemVzID0gbmV3IE1hcCgpKSB7XG4gIGxldCBpbm5lcklucHV0cyA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuXG4gIHNpemVzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICBsZXQgaXNGaXJzdCA9IGluZGV4ID09PSAwO1xuICAgIGNvbnN0IGlucHV0ID0gJChcImxhYmVsLnRhYi1zaXplXCIsIHt9LCBbXG4gICAgICAkKFwic3Bhbi5pY29uLnRleHQtd3JhcHBlci03XCIsIGtleSksXG4gICAgICAkKFwiaW5wdXQuc2l6ZS1pbnB1dFwiLCB7XG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgdHlwZTogXCJyYWRpb1wiLFxuICAgICAgICAgIG5hbWU6IFwic2l6ZXNcIixcbiAgICAgICAgICAuLi4oaXNGaXJzdCAmJiB7IGNoZWNrZWQ6IFwidHJ1ZVwiIH0pLFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZToga2V5LFxuICAgICAgfSksXG4gICAgICAkKFwic3Bhbi50ZXh0LXdyYXBwZXItN1wiLCB2YWx1ZS5zaXplKSxcbiAgICBdKTtcblxuICAgIGlubmVySW5wdXRzLnB1c2goaW5wdXQpO1xuICAgIGluZGV4ICs9IDE7XG4gIH0pO1xuXG4gIHJldHVybiBpbm5lcklucHV0cztcbn1cblxuZnVuY3Rpb24gY3JlYXRlQWRkaXRpdmVzSW5wdXRzKGFkZGl0aXZlcyA9IFtdKSB7XG4gIGxldCBpbm5lcklucHV0cyA9IFtdO1xuXG4gIGFkZGl0aXZlcy5mb3JFYWNoKChhZGRpdGl2ZSwgaSkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gJChcImxhYmVsLnRhYi1hZGRpdGl2ZVwiLCB7fSwgW1xuICAgICAgJChcInNwYW4uaWNvbi50ZXh0LXdyYXBwZXItN1wiLCBpICsgMSksXG4gICAgICAkKFwiaW5wdXQuYWRkaXRpdmUtaW5wdXRcIiwge1xuICAgICAgICBhdHRyczogeyB0eXBlOiBcImNoZWNrYm94XCIsIG5hbWU6IFwiYWRkaXRpdmVzXCIgfSxcbiAgICAgICAgdmFsdWU6IGFkZGl0aXZlLm5hbWUsXG4gICAgICB9KSxcbiAgICAgICQoXCJzcGFuLnRleHQtd3JhcHBlci03XCIsIGFkZGl0aXZlLm5hbWUpLFxuICAgIF0pO1xuICAgIGlubmVySW5wdXRzLnB1c2goaW5wdXQpO1xuICAgIGkgKz0gMTtcbiAgfSk7XG5cbiAgcmV0dXJuIGlubmVySW5wdXRzO1xufVxuIiwiZXhwb3J0IGNvbnN0IFNUQVJUX0NBVEVHT1JZID0gXCJjb2ZmZWVcIjsgLy8g0LjQu9C4IFwidGVhXCIsINGB0LzQvtGC0YDRjyDRh9GC0L4g0YMg0LLQsNGBINC/0L4g0LTQtdGE0L7Qu9GC0YNcbmV4cG9ydCBjb25zdCBQQUdFX1NJWkVfNzY4ID0gNDtcblxuZXhwb3J0IGNvbnN0IGRlbGF5ID0gKG1zKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuXG5leHBvcnQgZnVuY3Rpb24gd2l0aExvY2soZm4sIGRlbGF5ID0gNTAwKSB7XG4gIGxldCBpc0xvY2tlZCA9IGZhbHNlO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgIGlmIChpc0xvY2tlZCkgcmV0dXJuOyAvLyDQldGB0LvQuCDRgdGC0L7QuNGCINC30LDQvNC+0Log4oCUINC40LPQvdC+0YDQuNGA0YPQtdC8INC60LvQuNC6XG5cbiAgICBpc0xvY2tlZCA9IHRydWU7XG4gICAgZm4uYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlzTG9ja2VkID0gZmFsc2U7XG4gICAgfSwgZGVsYXkpO1xuICB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxuY29uc3QgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRjb25zdCBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0Y29uc3QgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdGNvbnN0IGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiY29uc3QgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG5sZXQgbGVhZlByb3RvdHlwZXM7XG4vLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3Rcbi8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuLy8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4vLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3Rcbi8vIG1vZGUgJiAxNjogcmV0dXJuIHZhbHVlIHdoZW4gaXQncyBQcm9taXNlLWxpa2Vcbi8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbl9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG5cdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IHRoaXModmFsdWUpO1xuXHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuXHRpZih0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlKSB7XG5cdFx0aWYoKG1vZGUgJiA0KSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYoKG1vZGUgJiAxNikgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbicpIHJldHVybiB2YWx1ZTtcblx0fVxuXHRjb25zdCBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG5cdGNvbnN0IGRlZiA9IHt9O1xuXHRsZWFmUHJvdG90eXBlcyA9IGxlYWZQcm90b3R5cGVzIHx8IFtudWxsLCBnZXRQcm90byh7fSksIGdldFByb3RvKFtdKSwgZ2V0UHJvdG8oZ2V0UHJvdG8pXTtcblx0Zm9yKHZhciBjdXJyZW50ID0gbW9kZSAmIDIgJiYgdmFsdWU7ICh0eXBlb2YgY3VycmVudCA9PSAnb2JqZWN0JyB8fCB0eXBlb2YgY3VycmVudCA9PSAnZnVuY3Rpb24nKSAmJiAhfmxlYWZQcm90b3R5cGVzLmluZGV4T2YoY3VycmVudCk7IGN1cnJlbnQgPSBnZXRQcm90byhjdXJyZW50KSkge1xuXHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGN1cnJlbnQpLmZvckVhY2goKGtleSkgPT4gKGRlZltrZXldID0gKCkgPT4gKHZhbHVlW2tleV0pKSk7XG5cdH1cblx0ZGVmWydkZWZhdWx0J10gPSAoKSA9PiAodmFsdWUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGRlZik7XG5cdHJldHVybiBucztcbn07IiwiLy8gZGVmaW5lIGdldHRlci92YWx1ZSBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5mID0ge307XG4vLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4vLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18uZSA9IChjaHVua0lkKSA9PiB7XG5cdHJldHVybiBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmYpLnJlZHVjZSgocHJvbWlzZXMsIGtleSkgPT4ge1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18uZltrZXldKGNodW5rSWQsIHByb21pc2VzKTtcblx0XHRyZXR1cm4gcHJvbWlzZXM7XG5cdH0sIFtdKSk7XG59OyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IChcImpzL1wiICsgY2h1bmtJZCArIFwiLlwiICsgXCJlMWE0ZmU3ZjA5OTdkMzkwZDg1M1wiICsgXCIuanNcIik7IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYWxsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5taW5pQ3NzRiA9IChjaHVua0lkKSA9PiAodW5kZWZpbmVkKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSk7IiwiY29uc3QgaW5Qcm9ncmVzcyA9IHt9O1xuLy8gZGF0YS13ZWJwYWNrIGlzIG5vdCB1c2VkIGFzIGJ1aWxkIGhhcyBubyB1bmlxdWVOYW1lXG4vLyBsb2FkU2NyaXB0IGZ1bmN0aW9uIHRvIGxvYWQgYSBzY3JpcHQgdmlhIHNjcmlwdCB0YWdcbl9fd2VicGFja19yZXF1aXJlX18ubCA9ICh1cmwsIGRvbmUsIGtleSwgY2h1bmtJZCkgPT4ge1xuXHRpZihpblByb2dyZXNzW3VybF0pIHsgaW5Qcm9ncmVzc1t1cmxdLnB1c2goZG9uZSk7IHJldHVybjsgfVxuXHRsZXQgc2NyaXB0LCBuZWVkQXR0YWNoO1xuXHRpZihrZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbnN0IHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc2NyaXB0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgcyA9IHNjcmlwdHNbaV07XG5cdFx0XHRpZihzLmdldEF0dHJpYnV0ZShcInNyY1wiKSA9PSB1cmwpIHsgc2NyaXB0ID0gczsgYnJlYWs7IH1cblx0XHR9XG5cdH1cblx0aWYoIXNjcmlwdCkge1xuXHRcdG5lZWRBdHRhY2ggPSB0cnVlO1xuXHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXG5cdFx0c2NyaXB0LmNoYXJzZXQgPSAndXRmLTgnO1xuXHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm5jKSB7XG5cdFx0XHRzY3JpcHQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgX193ZWJwYWNrX3JlcXVpcmVfXy5uYyk7XG5cdFx0fVxuXG5cblx0XHRzY3JpcHQuc3JjID0gdXJsO1xuXHR9XG5cdGluUHJvZ3Jlc3NbdXJsXSA9IFtkb25lXTtcblx0Y29uc3Qgb25TY3JpcHRDb21wbGV0ZSA9IChwcmV2LCBldmVudCkgPT4ge1xuXHRcdC8vIGF2b2lkIG1lbSBsZWFrcyBpbiBJRS5cblx0XHRzY3JpcHQub25lcnJvciA9IHNjcmlwdC5vbmxvYWQgPSBudWxsO1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHRjb25zdCBkb25lRm5zID0gaW5Qcm9ncmVzc1t1cmxdO1xuXHRcdGRlbGV0ZSBpblByb2dyZXNzW3VybF07XG5cdFx0c2NyaXB0LnBhcmVudE5vZGUgJiYgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcblx0XHRkb25lRm5zICYmIGRvbmVGbnMuZm9yRWFjaCgoZm4pID0+IChmbihldmVudCkpKTtcblx0XHRpZihwcmV2KSByZXR1cm4gcHJldihldmVudCk7XG5cdH1cblx0Y29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQob25TY3JpcHRDb21wbGV0ZS5iaW5kKG51bGwsIHVuZGVmaW5lZCwgeyB0eXBlOiAndGltZW91dCcsIHRhcmdldDogc2NyaXB0IH0pLCAxMjAwMDApO1xuXHRzY3JpcHQub25lcnJvciA9IG9uU2NyaXB0Q29tcGxldGUuYmluZChudWxsLCBzY3JpcHQub25lcnJvcik7XG5cdHNjcmlwdC5vbmxvYWQgPSBvblNjcmlwdENvbXBsZXRlLmJpbmQobnVsbCwgc2NyaXB0Lm9ubG9hZCk7XG5cdG5lZWRBdHRhY2ggJiYgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xufTsiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwibGV0IHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbmNvbnN0IGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQgJiYgZG9jdW1lbnQuY3VycmVudFNjcmlwdC50YWdOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdTQ1JJUFQnKVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdGNvbnN0IHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0bGV0IGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICghc2NyaXB0VXJsIHx8ICEvXmh0dHBzPzovLnRlc3Qoc2NyaXB0VXJsKSkpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoL15ibG9iOnxbPyNdLiokL2csIFwiXCIpLnJlcGxhY2UoL1xcL1teL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybCArIFwiLi4vXCI7IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbmNvbnN0IGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJwMlwiOiAwXG59O1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmYuaiA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuXHRcdC8vIEpTT05QIGNodW5rIGxvYWRpbmcgZm9yIGphdmFzY3JpcHRcblx0XHRsZXQgaW5zdGFsbGVkQ2h1bmtEYXRhID0gX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgPyBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gOiB1bmRlZmluZWQ7XG5cdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhICE9PSAwKSB7IC8vIDAgbWVhbnMgXCJhbHJlYWR5IGluc3RhbGxlZFwiLlxuXG5cdFx0XHQvLyBhIFByb21pc2UgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhKSB7XG5cdFx0XHRcdHByb21pc2VzLnB1c2goaW5zdGFsbGVkQ2h1bmtEYXRhWzJdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmKHRydWUpIHsgLy8gYWxsIGNodW5rcyBoYXZlIEpTXG5cdFx0XHRcdFx0Ly8gc2V0dXAgUHJvbWlzZSBpbiBjaHVuayBjYWNoZVxuXHRcdFx0XHRcdGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiAoaW5zdGFsbGVkQ2h1bmtEYXRhID0gaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gW3Jlc29sdmUsIHJlamVjdF0pKTtcblx0XHRcdFx0XHRwcm9taXNlcy5wdXNoKGluc3RhbGxlZENodW5rRGF0YVsyXSA9IHByb21pc2UpO1xuXG5cdFx0XHRcdFx0Ly8gY3JlYXRlIGVycm9yIGJlZm9yZSBzdGFjayB1bndvdW5kIHRvIGdldCB1c2VmdWwgc3RhY2t0cmFjZSBsYXRlclxuXHRcdFx0XHRcdGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCk7XG5cdFx0XHRcdFx0Y29uc3QgbG9hZGluZ0VuZGVkID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSkge1xuXHRcdFx0XHRcdFx0XHRpbnN0YWxsZWRDaHVua0RhdGEgPSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG5cdFx0XHRcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSAhPT0gMCkgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua0RhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBlcnJvclR5cGUgPSBldmVudCAmJiAoZXZlbnQudHlwZSA9PT0gJ2xvYWQnID8gJ21pc3NpbmcnIDogZXZlbnQudHlwZSk7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgcmVhbFNyYyA9IGV2ZW50ICYmIGV2ZW50LnRhcmdldCAmJiBldmVudC50YXJnZXQuc3JjO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9yLm1lc3NhZ2UgPSAnTG9hZGluZyBjaHVuayAnICsgY2h1bmtJZCArICcgZmFpbGVkLlxcbignICsgZXJyb3JUeXBlICsgJzogJyArIHJlYWxTcmMgKyAnKSc7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IubmFtZSA9ICdDaHVua0xvYWRFcnJvcic7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IudHlwZSA9IGVycm9yVHlwZTtcblx0XHRcdFx0XHRcdFx0XHRlcnJvci5yZXF1ZXN0ID0gcmVhbFNyYztcblx0XHRcdFx0XHRcdFx0XHRlcnJvci5ldmVudCA9IGV2ZW50O1xuXHRcdFx0XHRcdFx0XHRcdGluc3RhbGxlZENodW5rRGF0YVsxXShlcnJvcik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubChfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLnUoY2h1bmtJZCksIGxvYWRpbmdFbmRlZCwgXCJjaHVuay1cIiArIGNodW5rSWQsIGNodW5rSWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxufTtcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbmNvbnN0IHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdGxldCBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXG59XG5cbmNvbnN0IGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtcIl0gPSBzZWxmW1wid2VicGFja0NodW5rXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCJpbXBvcnQgQnVyZ2VyTWVudSBmcm9tIFwiLi9CdXJnZXJNZW51XCI7XG5pbXBvcnQgeyBkZWxheSwgUEFHRV9TSVpFXzc2OCwgd2l0aExvY2sgfSBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCBNZW51TW9kZWwgZnJvbSBcIi4vTWVudU1vZGVsXCI7XG5pbXBvcnQgeyByZW5kZXLQnNC+ZGFsQ2FydCB9IGZyb20gXCIuL01vZGFsQ2FydFVJXCI7XG5cbmNvbnN0IG1lZGlhUXVlcnkgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKTtcblxuY29uc3QgbGlnaHRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpZ2h0XCIpO1xuY29uc3QgZGFya0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGFya1wiKTtcbmNvbnN0IGdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdyaWRcIik7XG5jb25zdCBpdGVtUHJldmlldyA9IGdyaWQucXVlcnlTZWxlY3RvcihcIi5wcmV2aWV3XCIpO1xuY29uc3QgcmVmcmVzaEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnV0dG9uLXJlZnJlc2hcIik7XG5cbmNvbnN0IGJ1cmdlckJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnV0dG9uLWljb24tYnVyZ2VyXCIpO1xuY29uc3QgYnVyZ2VyQWNpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ1cmdlci1uYXZcIik7XG5cbmNvbnN0IGJ1cmdlck1lbnUgPSBuZXcgQnVyZ2VyTWVudShidXJnZXJCdXR0b24sIGJ1cmdlckFjaWRlKTtcblxuY29uc3QgY3JlYXRlSW1hZ2UgPSAoc3JjKSA9PlxuICBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcub25sb2FkID0gKCkgPT4gcmVzKGltZyk7XG4gICAgaW1nLm9uZXJyb3IgPSByZWo7XG4gICAgaW1nLnNyYyA9IHNyYztcbiAgfSk7XG5cbmNvbnN0IG1lbnVNb2RlbCA9IG5ldyBNZW51TW9kZWwoKTtcblxuY29uc3QgdXBkYXRlUHJpY2UgPSAoKSA9PiB7XG4gIGxldCBzZWxlY3RBZGRpdGl2ZXMgPSBbXTtcbiAgY29uc3QgYWRkaXRpdmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hZGRpdGl2ZS1pbnB1dDpjaGVja2VkXCIpO1xuICBhZGRpdGl2ZXMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICBzZWxlY3RBZGRpdGl2ZXMucHVzaChpbnB1dC52YWx1ZSk7XG4gIH0pO1xuXG4gIGNvbnN0IHNpemVWYWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2l6ZS1pbnB1dDpjaGVja2VkXCIpLnZhbHVlO1xuICBtZW51TW9kZWwuY2FsY1ByaWNlKHNpemVWYWx1ZSwgc2VsZWN0QWRkaXRpdmVzKTtcbn07XG5cbm1lbnVNb2RlbC5zdWJzY3JpYmUoc3RhdGVSZWR1Y2VyKTtcblxuaWYgKG1lZGlhUXVlcnkubWF0Y2hlcykge1xuICBtZW51TW9kZWwucGFnZVNpemUgPSBQQUdFX1NJWkVfNzY4O1xufVxuXG5jb25zdCB0YWJzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YWJzXCIpO1xuXG5hc3luYyBmdW5jdGlvbiByZW5kZXIoKSB7XG4gIG1lZGlhUXVlcnkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBoYW5kbGVTY3JlZW5DaGFuZ2UpO1xuICBoYW5kbGVTY3JlZW5DaGFuZ2UobWVkaWFRdWVyeSk7XG5cbiAgZGFya0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgbWVudU1vZGVsLnNldFRoZW1lKHRydWUpO1xuICB9KTtcblxuICBsaWdodEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgbWVudU1vZGVsLnNldFRoZW1lKCk7XG4gIH0pO1xuXG4gIHRhYnNDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGNsaWNrZWRUYWIgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi50YWItaXRlbVwiKTtcbiAgICBpZiAoIWNsaWNrZWRUYWIgfHwgY2xpY2tlZFRhYi5nZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIpID09PSBcInRydWVcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdDYXRlZ29yeSA9IGNsaWNrZWRUYWIuZGF0YXNldC5jYXRlZ29yeTtcbiAgICB1cGRhdGVDYXRlZ29yeShuZXdDYXRlZ29yeSk7XG4gICAgbWVudU1vZGVsLmdldEZpbHRlclByb2R1Y3QobmV3Q2F0ZWdvcnkpO1xuICB9KTtcblxuICByZWZyZXNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgXCJjbGlja1wiLFxuICAgIHdpdGhMb2NrKCgpID0+IHtcbiAgICAgIG1lbnVNb2RlbC5nZXROZXh0UGFnZSgpO1xuICAgIH0sIDQwMCksXG4gICk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNjcmVlbkNoYW5nZShldmVudCkge1xuICBpZiAoZXZlbnQubWF0Y2hlcykge1xuICAgIG1lbnVNb2RlbC5wYWdlU2l6ZSA9IFBBR0VfU0laRV83Njg7XG4gIH0gZWxzZSB7XG4gICAgbWVudU1vZGVsLnBhZ2VTaXplID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlckl0ZW1QcmV2aWV3KHByb2R1Y3QsIGl0ZW0gPSB1bmRlZmluZWQpIHtcbiAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0gPSBpdGVtUHJldmlldy5jbG9uZU5vZGUodHJ1ZSk7XG4gIH1cblxuICBsZXQgaW1nID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiLmJveC1wcm9kdWN0LWl0ZW1cIik7XG4gIGxldCB0aXRsZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcihcIi50aXRsZVwiKTtcbiAgbGV0IGRlc2NyaXB0aW9uID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uLXByb2R1Y3QtaXRlbVwiKTtcbiAgbGV0IHByaWNlID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiLnByaWNlXCIpO1xuICB0aXRsZS50ZXh0Q29udGVudCA9IHByb2R1Y3QubmFtZTtcbiAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSBwcm9kdWN0LmRlc2NyaXB0aW9uO1xuICBwcmljZS50ZXh0Q29udGVudCA9IFwiJFwiICsgcHJvZHVjdC5wcmljZTtcbiAgY29uc3QgaW1hZ2VTcmMgPSBgaW1hZ2VzLyR7cHJvZHVjdC5jYXRlZ29yeX0tJHtwcm9kdWN0LmlkfS5wbmdgO1xuICB0cnkge1xuICAgIGNvbnN0IG5ld0ltZyA9IGF3YWl0IGNyZWF0ZUltYWdlKGltYWdlU3JjKTtcbiAgICBuZXdJbWcuY2xhc3NMaXN0LmFkZChcImJveC1wcm9kdWN0LWl0ZW1cIik7XG4gICAgaWYgKGltZykge1xuICAgICAgaW1nLnJlcGxhY2VXaXRoKG5ld0ltZyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICBg0J3QtSDRg9C00LDQu9C+0YHRjCDQt9Cw0LPRgNGD0LfQuNGC0Ywg0LrQsNGA0YLQuNC90LrRgyDQtNC70Y8g0YLQvtCy0LDRgNCwICR7cHJvZHVjdC5uYW1lfTpgLFxuICAgICAgZXJyb3IsXG4gICAgKTtcbiAgfVxuICBpdGVtLmRhdGFzZXQuY2F0ZWdvcnkgPSBwcm9kdWN0LmNhdGVnb3J5O1xuICBpdGVtLmlkID0gYHByb2R1Y3QtMCR7cHJvZHVjdC5pZH1gO1xuICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJmYWRlLWluXCIsIFwiZmFkZS1vdXRcIik7XG5cbiAgY29uc3QgaGFuZGxlQ2FyZENsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0SWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmlkO1xuICAgIG1lbnVNb2RlbC5nZXRNb2RhbCh0YXJnZXRJZCk7XG4gIH07XG4gIGl0ZW0ub25jbGljayA9IGhhbmRsZUNhcmRDbGljaztcblxuICByZXR1cm4gaXRlbTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVuZGVyQ2FydHMoYW5zd2VyKSB7XG4gIGNvbnN0IGRhdGEgPSBhbnN3ZXIuZGF0YTtcbiAgY29uc3QgcHJvZHVjdHMgPSBkYXRhLml0ZW1zO1xuICBwcm9kdWN0cy5mb3JFYWNoKGFzeW5jIGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgbGV0IG5ld0l0ZW0gPSBhd2FpdCByZW5kZXJJdGVtUHJldmlldyhwcm9kdWN0KTtcbiAgICBncmlkLmFwcGVuZENoaWxkKG5ld0l0ZW0pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbmV3SXRlbS5jbGFzc0xpc3QuYWRkKFwiZmFkZS1pblwiKTtcbiAgICB9LCA1MCk7XG4gIH0pO1xuXG4gIGlmIChkYXRhLmZpbmlzaCkge1xuICAgIHJlZnJlc2hCdXR0b24uY2xhc3NMaXN0LmFkZChcImZhZGUtb3V0XCIpO1xuICB9IGVsc2Uge1xuICAgIHJlZnJlc2hCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImZhZGUtb3V0XCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXRlUmVkdWNlcihhY3Rpb25UeXBlLCBwYXlsb2FkKSB7XG4gIHN3aXRjaCAoYWN0aW9uVHlwZSkge1xuICAgIGNhc2UgXCJjdXJyZW50Q2F0ZWdvcnlcIjpcbiAgICAgIHVwZGF0ZUNhdGVnb3J5TGF5b3V0KHBheWxvYWQpLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJyZW1vdmVDYXJ0c1RvQ291bnRcIjpcbiAgICAgIHJlbW92ZUNhcnRzKHBheWxvYWQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiYWRkQ2FydHNcIjpcbiAgICAgIHJlbmRlckNhcnRzKHBheWxvYWQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwidGhlbWVcIjpcbiAgICAgIHN3aXRjaFRoZW1lKHBheWxvYWQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwibW9kYWxcIjpcbiAgICAgIHJlbmRlctCc0L5kYWwocGF5bG9hZCkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImNhbGNQcmljZVwiOlxuICAgICAgdXBkYXRlUHJpY2VPblNjcmVlbihwYXlsb2FkKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbnNvbGUubG9nKGDQodC+0LHRi9GC0LjQtSAke2FjdGlvblR5cGV9INC90LUg0LLQu9C40Y/QtdGCINC90LAgRE9NINGN0YLQvtC5INGB0YLRgNCw0L3QuNGG0YtgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzd2l0Y2hUaGVtZShkYXRhVGhlbWUpIHtcbiAgaWYgKGRhdGFUaGVtZSkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwiZGFya1wiKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS10aGVtZVwiKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiByZW5kZXLQnNC+ZGFsKGFuc3dlcikge1xuICBjb25zdCBtb2RhbENhcnQgPSByZW5kZXLQnNC+ZGFsQ2FydChhbnN3ZXIuZGF0YSwgdXBkYXRlUHJpY2UpO1xuICBpZiAobW9kYWxDYXJ0IGluc3RhbmNlb2YgSFRNTERpYWxvZ0VsZW1lbnQpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmQtbWVudVwiKS5hcHBlbmRDaGlsZChtb2RhbENhcnQpO1xuICAgIG1vZGFsQ2FydC5zaG93TW9kYWwoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVQcmljZU9uU2NyZWVuKGFuc3dlcikge1xuICBjb25zdCBmaW5hbFByaWNlID0gYW5zd2VyLmRhdGE7XG4gIGNvbnN0IHRvdGFsUHJpY2VFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1wcmljZVwiKTtcbiAgaWYgKCF0b3RhbFByaWNlRWxlbWVudCkgcmV0dXJuO1xuICB0b3RhbFByaWNlRWxlbWVudC50ZXh0Q29udGVudCA9IGAke2ZpbmFsUHJpY2UudG9GaXhlZCgyKX0gJGA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhdGVnb3J5TGF5b3V0KGFuc3dlcikge1xuICBjb25zdCBjaGVja2VkQ2F0ZWdvcnkgPSB0YWJzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgXCIudGFiLWl0ZW1bYXJpYS1zZWxlY3RlZD0ndHJ1ZSddXCIsXG4gICkuZGF0YXNldC5jYXRlZ29yeTtcbiAgY29uc3QgY3VycmVudENhdGVnb3J5ID0gbWVudU1vZGVsLmN1cnJlbnRDYXRlZ29yeTtcbiAgaWYgKGNoZWNrZWRDYXRlZ29yeSAhPT0gY3VycmVudENhdGVnb3J5KSB7XG4gICAgdXBkYXRlQ2F0ZWdvcnkoY3VycmVudENhdGVnb3J5KTtcbiAgfVxuICByZW1vdmVDYXJ0cygpO1xuICBhd2FpdCByZW5kZXJDYXJ0cyhhbnN3ZXIpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDYXJ0cyhhbnN3ZXIgPSB1bmRlZmluZWQpIHtcbiAgY29uc3QgcHJldmlld3NMaXN0ID0gZ3JpZC5xdWVyeVNlbGVjdG9yQWxsKFwiLnByZXZpZXdcIik7XG4gIGxldCBwcmV2aWV3cyA9IFsuLi5wcmV2aWV3c0xpc3RdO1xuXG4gIHByZXZpZXdzLnJldmVyc2UoKTtcbiAgaWYgKGFuc3dlcikge1xuICAgIHByZXZpZXdzLnNwbGljZShhbnN3ZXIuZGF0YSAqIC0xKTtcbiAgICBpZiAocHJldmlld3MubGVuZ3RoID4gMCkge1xuICAgICAgcmVmcmVzaEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmFkZS1vdXRcIik7XG4gICAgfVxuICB9XG5cbiAgcHJldmlld3MuZm9yRWFjaChhc3luYyAoY2FyZCkgPT4ge1xuICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcImZhZGUtb3V0XCIpO1xuICAgIGF3YWl0IGRlbGF5KDMwMCk7XG4gICAgY2FyZC5yZW1vdmUoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNhdGVnb3J5KGNhdGVnb3J5KSB7XG4gIGNvbnN0IGFsbFRhYnMgPSB0YWJzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGFiLWl0ZW1cIik7XG4gIGFsbFRhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgaWYgKHRhYi5kYXRhc2V0LmNhdGVnb3J5ID09PSBjYXRlZ29yeSkge1xuICAgICAgdGFiLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgXCJ0cnVlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBcImZhbHNlXCIpO1xuICAgIH1cbiAgfSk7XG59XG5cbnJlbmRlcigpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9