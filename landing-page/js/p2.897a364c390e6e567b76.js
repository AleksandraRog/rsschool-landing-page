/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
      currentCategory: [], // Сюда будет прилетать массив карточек для полной перезагрузки
      addCarts: [], // Сюда — порция карточек для пагинации
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
        items: nextPortion,
        finish: fp.length <= newFinish,
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
    this.init().then(() => console.log("hi"));
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
        $("button.button-3.modal-close-button", {
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
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./config.js");
/* harmony import */ var _MenuModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MenuModel */ "./MenuModel.js");
/* harmony import */ var _ModalCartUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ModalCartUI */ "./ModalCartUI.js");




const mediaQuery = window.matchMedia("(max-width: 768px)");

const lightButton = document.querySelector(".light");
const darkButton = document.querySelector(".dark");
const grid = document.querySelector(".grid");
const itemPreview = grid.querySelector(".preview");
const refreshButton = document.querySelector(".button-refresh");

const createImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

const menuModel = new _MenuModel__WEBPACK_IMPORTED_MODULE_1__["default"]();
if (mediaQuery.matches) {
  menuModel.pageSize = _config__WEBPACK_IMPORTED_MODULE_0__.PAGE_SIZE_768;
}

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
    (0,_config__WEBPACK_IMPORTED_MODULE_0__.withLock)(() => {
      menuModel.getNextPage();
    }, 400),
  );
}

function handleScreenChange(event) {
  if (event.matches) {
    menuModel.pageSize = _config__WEBPACK_IMPORTED_MODULE_0__.PAGE_SIZE_768;
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
  const modalCart = (0,_ModalCartUI__WEBPACK_IMPORTED_MODULE_2__["renderМоdalCart"])(answer.data, updatePrice);
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
    await (0,_config__WEBPACK_IMPORTED_MODULE_0__.delay)(300);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vRGF0YUNsaWVudC5qcyIsIndlYnBhY2s6Ly8vLi9JdGVtVUkuanMiLCJ3ZWJwYWNrOi8vLy4vTWVudUl0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vTWVudU1vZGVsLmpzIiwid2VicGFjazovLy8uL01vZGFsQ2FydFVJLmpzIiwid2VicGFjazovLy8uL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jcmVhdGUgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2dldCBtaW5pLWNzcyBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2xvYWQgc2NyaXB0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vLy4vbWVudS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY2xhc3MgRGF0YUNsaWVudCB7XHJcbiAgY29uc3RydWN0b3IobmFtZXNwYWNlID0gXCJjb2ZmZWUtaG91c2VcIikge1xyXG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRJdGVtKGtleSA9ICcnKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMubmFtZXNwYWNlfToke2tleX1gKTtcclxuICAgIHJldHVybiB2YWx1ZSA/IEpTT04ucGFyc2UodmFsdWUpIDogbnVsbDtcclxuICB9XHJcblxyXG4gIHNldEl0ZW0oa2V5ID0gJycsIHZhbHVlID0gdW5kZWZpbmVkKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLm5hbWVzcGFjZX06JHtrZXl9YCwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUl0ZW0oa2V5ID0gJycpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGAke3RoaXMubmFtZXNwYWNlfToke2tleX1gKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGFDbGllbnRcclxuIiwiY2xhc3MgSXRlbVVJIHtcbiAgY29uc3RydWN0b3Ioe1xuICAgIHRhZyA9IFwiZGl2XCIsXG4gICAgY2xhc3NOYW1lcyA9IFtdLFxuICAgIGlubmVycyA9IFtdLFxuICAgIHRleHQgPSB1bmRlZmluZWQsXG4gICAgdmFsdWUgPSB1bmRlZmluZWQsXG4gICAgYXR0cnMgPSB7fSxcbiAgICBldmVudHMgPSB7fSxcbiAgfSA9IHt9KSB7XG4gICAgdGhpcy50YWcgPSB0YWc7XG4gICAgdGhpcy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcbiAgICB0aGlzLmlubmVycyA9IGlubmVycztcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmF0dHJzID0gYXR0cnM7XG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgdGhpcy51aUVsZW1lbnQgPSB0aGlzLmNyZWF0ZU15RWxlbWVudCgpO1xuICB9XG5cbiAgY3JlYXRlTXlFbGVtZW50KCkge1xuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnRhZyk7XG5cbiAgICB0aGlzLmNsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnRleHQpIHtcbiAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy50ZXh0O1xuICAgIH1cblxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuYXR0cnMpLmZvckVhY2goKFtrLCB2XSkgPT4gZWxlbWVudC5zZXRBdHRyaWJ1dGUoaywgdikpO1xuXG4gICAgaWYgKHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZWxlbWVudC52YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5ldmVudHMpLmZvckVhY2goKFtldmVudE5hbWUsIGhhbmRsZXJdKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuaW5uZXJzLmZvckVhY2goKGlubmVyRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGlubmVyRWxlbWVudCBpbnN0YW5jZW9mIEl0ZW1VSSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGlubmVyRWxlbWVudC51aUVsZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmIChpbm5lckVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGlubmVyRWxlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5pbm5lcnMuZm9yRWFjaCgoaW5uZXIpID0+IHtcbiAgICAgIGlmIChpbm5lciBpbnN0YW5jZW9mIEl0ZW1VSSkge1xuICAgICAgICBpbm5lci5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy51aUVsZW1lbnQgJiYgdGhpcy51aUVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy51aUVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy51aUVsZW1lbnQgPSBudWxsO1xuICAgIHRoaXMuaW5uZXJzID0gW107XG4gICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUodGFnQW5kQ2xhc3NlcywgY29uZmlnT3JJbm5lcnMgPSB7fSwgcG9zc2libGVJbm5lcnMgPSBbXSkge1xuICAgIGxldCB0YXJnZXRTdHJpbmcgPSB0YWdBbmRDbGFzc2VzLnRyaW0oKTtcbiAgICBpZiAodGFyZ2V0U3RyaW5nLnN0YXJ0c1dpdGgoXCIuXCIpKSB7XG4gICAgICB0YXJnZXRTdHJpbmcgPSBcImRpdlwiICsgdGFyZ2V0U3RyaW5nO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnRzID0gdGFyZ2V0U3RyaW5nLnNwbGl0KFwiLlwiKTtcbiAgICBjb25zdCB0YWcgPSBwYXJ0c1swXSB8fCBcImRpdlwiO1xuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBwYXJ0cy5zbGljZSgxKTtcblxuICAgIGxldCBjb25maWcgPSB7fTtcbiAgICBsZXQgaW5uZXJzID0gcG9zc2libGVJbm5lcnM7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb25maWdPcklubmVycykpIHtcbiAgICAgIGlubmVycyA9IGNvbmZpZ09ySW5uZXJzO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0eXBlb2YgY29uZmlnT3JJbm5lcnMgPT09IFwic3RyaW5nXCIgfHxcbiAgICAgIHR5cGVvZiBjb25maWdPcklubmVycyA9PT0gXCJudW1iZXJcIlxuICAgICkge1xuICAgICAgY29uZmlnLnRleHQgPSBjb25maWdPcklubmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnID0geyAuLi5jb25maWdPcklubmVycyB9O1xuICAgIH1cblxuICAgIGlmIChpbm5lcnMubGVuZ3RoID4gMCkgY29uZmlnLmlubmVycyA9IGlubmVycztcbiAgICBjb25maWcudGFnID0gdGFnO1xuICAgIGNvbmZpZy5jbGFzc05hbWVzID0gWy4uLmNsYXNzTmFtZXMsIC4uLihjb25maWcuY2xhc3NOYW1lcyB8fCBbXSldO1xuXG4gICAgcmV0dXJuIG5ldyBJdGVtVUkoY29uZmlnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJdGVtVUk7XG4iLCJjbGFzcyBNZW51SXRlbSB7XG4gIGNvbnN0cnVjdG9yKHsgaWQsIG5hbWUsIGRlc2NyaXB0aW9uLCBwcmljZSwgY2F0ZWdvcnksIHNpemVzLCBhZGRpdGl2ZXMgfSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnByaWNlID0gcHJpY2U7XG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgIHRoaXMuc2l6ZXMgPSBzaXplcztcbiAgICB0aGlzLmFkZGl0aXZlcyA9IGFkZGl0aXZlcztcblxuICAgIHRoaXMuX3NpemVNYXAgPSBuZXcgTWFwKFxuICAgICAgT2JqZWN0LmVudHJpZXMoc2l6ZXMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBbXG4gICAgICAgIGtleS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICB7XG4gICAgICAgICAgc2l6ZTogdmFsdWUuc2l6ZSxcbiAgICAgICAgICBhZGRQcmljZTogcGFyc2VGbG9hdCh2YWx1ZVtcImFkZC1wcmljZVwiXSksXG4gICAgICAgIH0sXG4gICAgICBdKSxcbiAgICApO1xuICB9XG5cbiAgZ2V0IGdldFNpemVzKCkge1xuICAgIHJldHVybiB0aGlzLl9zaXplTWFwO1xuICB9XG5cbiAgdG90YWxQcmljZShzaXplLCBhZGRpdGl2ZXMgPSBbXSkge1xuICAgIGxldCBmaW5hbFByaWNlID0gcGFyc2VGbG9hdCh0aGlzLnByaWNlKTtcbiAgICBjb25zdCBhY3RpdmVTaXplS2V5ID0gc2l6ZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgaWYgKHRoaXMuX3NpemVNYXAuaGFzKGFjdGl2ZVNpemVLZXkpKSB7XG4gICAgICBmaW5hbFByaWNlICs9IHRoaXMuX3NpemVNYXAuZ2V0KGFjdGl2ZVNpemVLZXkpLmFkZFByaWNlO1xuICAgIH1cblxuICAgIGFkZGl0aXZlcy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBhY3RpdmVBZGRpdGl2ZSA9IHRoaXMuYWRkaXRpdmVzLmZpbmQoXG4gICAgICAgIChhZGRpdGl2ZSkgPT4gYWRkaXRpdmUubmFtZSA9PT0gbmFtZSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChhY3RpdmVBZGRpdGl2ZSAmJiBhY3RpdmVBZGRpdGl2ZVtcImFkZC1wcmljZVwiXSkge1xuICAgICAgICBmaW5hbFByaWNlICs9IHBhcnNlRmxvYXQoYWN0aXZlQWRkaXRpdmVbXCJhZGQtcHJpY2VcIl0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaW5hbFByaWNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lbnVJdGVtO1xuIiwiaW1wb3J0IERhdGFDbGllbnQgZnJvbSBcIi4vRGF0YUNsaWVudFwiO1xuaW1wb3J0IE1lbnVJdGVtIGZyb20gXCIuL01lbnVJdGVtXCI7XG5cbmltcG9ydCB7IFNUQVJUX0NBVEVHT1JZIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5cbmNsYXNzIE1lbnVNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Byb2R1Y3RzID0gW107XG4gICAgdGhpcy5fY2F0ZWdvcnkgPSBcIlwiO1xuICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gMDtcbiAgICB0aGlzLl9wYWdlU2l6ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9jdXJyZW50Q2FydCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl90aGVtZSA9IGZhbHNlO1xuICAgIHRoaXMuZGF0YUNsaWVudCA9IG5ldyBEYXRhQ2xpZW50KCk7XG5cbiAgICBjb25zdCBkZWZhdWx0U3RhdGUgPSB7XG4gICAgICBjdXJyZW50Q2F0ZWdvcnk6IFtdLCAvLyDQodGO0LTQsCDQsdGD0LTQtdGCINC/0YDQuNC70LXRgtCw0YLRjCDQvNCw0YHRgdC40LIg0LrQsNGA0YLQvtGH0LXQuiDQtNC70Y8g0L/QvtC70L3QvtC5INC/0LXRgNC10LfQsNCz0YDRg9C30LrQuFxuICAgICAgYWRkQ2FydHM6IFtdLCAvLyDQodGO0LTQsCDigJQg0L/QvtGA0YbQuNGPINC60LDRgNGC0L7Rh9C10Log0LTQu9GPINC/0LDQs9C40L3QsNGG0LjQuFxuICAgICAgbW9kYWw6IG51bGwsXG4gICAgICB0aGVtZTogZmFsc2UsXG4gICAgICBjYWxjUHJpY2U6IDAsXG4gICAgICByZW1vdmVDYXJ0c1RvQ291bnQ6IDAsXG4gICAgfTtcblxuICAgIHRoaXMuX3N0YXRlID0gbmV3IFByb3h5KGRlZmF1bHRTdGF0ZSwge1xuICAgICAgc2V0OiAodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHRhcmdldFtwcm9wZXJ0eV0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVyKSB7XG4gICAgICAgICAgdGhpcy5saXN0ZW5lcihwcm9wZXJ0eSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICBjb25zdCBkYXRhVGhlbWUgPSBhd2FpdCB0aGlzLmRhdGFDbGllbnQuZ2V0SXRlbShcInRoZW1lXCIpO1xuXG4gICAgY29uc3QgcHJvZHVjdHNNb2R1bGUgPSBhd2FpdCBpbXBvcnQoXCIuL2ltYWdlcy9wcm9kdWN0cy5qc29uXCIsIHtcbiAgICAgIHdpdGg6IHsgdHlwZTogXCJqc29uXCIgfSxcbiAgICB9KTtcbiAgICB0aGlzLl9wcm9kdWN0cyA9IHByb2R1Y3RzTW9kdWxlLmRlZmF1bHQubWFwKChpdGVtKSA9PiBuZXcgTWVudUl0ZW0oaXRlbSkpO1xuXG4gICAgdGhpcy5fY2F0ZWdvcnkgPSBTVEFSVF9DQVRFR09SWTtcblxuICAgIHRoaXMuc2V0VGhlbWUoZGF0YVRoZW1lKTtcbiAgICB0aGlzLmdldEZpbHRlclByb2R1Y3QoU1RBUlRfQ0FURUdPUlkpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRDYXRlZ29yeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2F0ZWdvcnk7XG4gIH1cbiAgZ2V0RmlsdGVyUHJvZHVjdChjYXRlZ29yeSkge1xuICAgIHRoaXMuX2NhdGVnb3J5ID0gY2F0ZWdvcnk7XG4gICAgdGhpcy5fY3VycmVudFBhZ2UgPSAwO1xuXG4gICAgY29uc3QgZnAgPSB0aGlzLl9wcm9kdWN0cy5maWx0ZXIoXG4gICAgICAocHJvZHVjdCkgPT4gcHJvZHVjdC5jYXRlZ29yeSA9PT0gdGhpcy5fY2F0ZWdvcnksXG4gICAgKTtcblxuICAgIGxldCByZXN1bHQgPSBmcDtcblxuICAgIGlmICh0aGlzLl9wYWdlU2l6ZSAmJiB0aGlzLl9wYWdlU2l6ZSA8IGZwLmxlbmd0aCkge1xuICAgICAgcmVzdWx0ID0gZnAuc2xpY2UodGhpcy5fY3VycmVudFBhZ2UsIHRoaXMuX2N1cnJlbnRQYWdlICsgdGhpcy5fcGFnZVNpemUpO1xuICAgIH1cblxuICAgIHRoaXMuX3N0YXRlLmN1cnJlbnRDYXRlZ29yeSA9IHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgaXRlbXM6IHJlc3VsdCxcbiAgICAgICAgZmluaXNoOiAhdGhpcy5fcGFnZVNpemUgfHwgdGhpcy5fcGFnZVNpemUgPj0gZnAubGVuZ3RoLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxuICAgKi9cbiAgc2V0IHBhZ2VTaXplKHNpemUpIHtcbiAgICBpZiAodGhpcy5fcGFnZVNpemUgPT09IHNpemUpIHJldHVybjtcbiAgICBjb25zdCBvbGRQYWdlU2l6ZSA9IHRoaXMuX3BhZ2VTaXplO1xuICAgIHRoaXMuX3BhZ2VTaXplID0gc2l6ZTtcblxuICAgIGlmICghdGhpcy5fY2F0ZWdvcnkpIHJldHVybjtcblxuICAgIGlmICgoIW9sZFBhZ2VTaXplICYmIHNpemUpIHx8IChvbGRQYWdlU2l6ZSAmJiBvbGRQYWdlU2l6ZSA+IHNpemUpKSB7XG4gICAgICB0aGlzLl9zdGF0ZS5yZW1vdmVDYXJ0c1RvQ291bnQgPSB7IGRhdGE6IHRoaXMuX3BhZ2VTaXplIH07XG4gICAgICB0aGlzLl9jdXJyZW50UGFnZSA9IDE7XG4gICAgfSBlbHNlIGlmIChvbGRQYWdlU2l6ZSAmJiAhc2l6ZSkge1xuICAgICAgdGhpcy5nZXROZXh0UGFnZShvbGRQYWdlU2l6ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TmV4dFBhZ2UocGFnZVNpemUgPSB0aGlzLl9wYWdlU2l6ZSkge1xuICAgIGNvbnN0IGZwID0gdGhpcy5fcHJvZHVjdHMuZmlsdGVyKFxuICAgICAgKHByb2R1Y3QpID0+IHByb2R1Y3QuY2F0ZWdvcnkgPT09IHRoaXMuX2NhdGVnb3J5LFxuICAgICk7XG5cbiAgICBpZiAodGhpcy5fcGFnZVNpemUpIHtcbiAgICAgIGNvbnN0IG5ld0ZpcnN0ID0gdGhpcy5fY3VycmVudFBhZ2UgKiBwYWdlU2l6ZTtcbiAgICAgIGNvbnN0IG5ld0ZpbmlzaCA9IG5ld0ZpcnN0ICsgcGFnZVNpemU7XG4gICAgICBjb25zdCBuZXh0UG9ydGlvbiA9IGZwLnNsaWNlKG5ld0ZpcnN0LCBNYXRoLm1pbihuZXdGaW5pc2gsIGZwLmxlbmd0aCkpO1xuICAgICAgdGhpcy5fc3RhdGUuYWRkQ2FydHMgPSB7XG4gICAgICAgIGl0ZW1zOiBuZXh0UG9ydGlvbixcbiAgICAgICAgZmluaXNoOiBmcC5sZW5ndGggPD0gbmV3RmluaXNoLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX2N1cnJlbnRQYWdlICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG5ld0ZpcnN0ID0gdGhpcy5fY3VycmVudFBhZ2UgKiBwYWdlU2l6ZTtcbiAgICAgIGNvbnN0IG5ld0ZpbmlzaCA9IGZwLmxlbmd0aDtcbiAgICAgIGNvbnN0IG5leHRQb3J0aW9uID0gZnAuc2xpY2UobmV3Rmlyc3QsIE1hdGgubWluKG5ld0ZpbmlzaCwgZnAubGVuZ3RoKSk7XG4gICAgICB0aGlzLl9zdGF0ZS5hZGRDYXJ0cyA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGl0ZW1zOiBuZXh0UG9ydGlvbixcbiAgICAgICAgICBmaW5pc2g6IGZwLmxlbmd0aCA8PSBuZXdGaW5pc2gsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgdGhpcy5fY3VycmVudFBhZ2UgPSAxO1xuICAgIH1cbiAgfVxuXG4gIGdldE1vZGFsKGlkKSB7XG4gICAgY29uc3QgY2xlYW5JZCA9IE51bWJlcihpZC5yZXBsYWNlKC9bXlxcZF0vZywgXCJcIikpO1xuXG4gICAgdGhpcy5fY3VycmVudENhcnQgPSB0aGlzLl9wcm9kdWN0cy5maW5kKFxuICAgICAgKHByb2R1Y3QpID0+XG4gICAgICAgIHByb2R1Y3QuY2F0ZWdvcnkgPT09IHRoaXMuX2NhdGVnb3J5ICYmIE51bWJlcihwcm9kdWN0LmlkKSA9PSBjbGVhbklkLFxuICAgICk7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50Q2FydCkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgYNCi0L7QstCw0YAg0YEgSUQgJHtjbGVhbklkfSDQsiDQutCw0YLQtdCz0L7RgNC40LggJHt0aGlzLl9jYXRlZ29yeX0g0L3QtSDQvdCw0LnQtNC10L0uYCxcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3N0YXRlLm1vZGFsID0geyBkYXRhOiB0aGlzLl9jdXJyZW50Q2FydCB9O1xuICB9XG5cbiAgc2V0VGhlbWUodGhlbWUgPSBmYWxzZSkge1xuICAgIHRoaXMuX3N0YXRlLnRoZW1lID0gdGhlbWU7XG4gICAgdGhpcy5kYXRhQ2xpZW50LnNldEl0ZW0oXCJ0aGVtZVwiLCB0aGVtZSk7XG4gIH1cblxuICBjYWxjUHJpY2Uoc2l6ZVZhbHVlID0gXCJTXCIsIHNlbGVjdEFkZGl0aXZlcyA9IFtdKSB7XG4gICAgY29uc3QgdG90YWxQcmljZSA9IHRoaXMuX2N1cnJlbnRDYXJ0LnRvdGFsUHJpY2Uoc2l6ZVZhbHVlLCBzZWxlY3RBZGRpdGl2ZXMpO1xuXG4gICAgdGhpcy5fc3RhdGUuY2FsY1ByaWNlID0geyBkYXRhOiB0b3RhbFByaWNlIH07XG4gIH1cblxuICBzdWJzY3JpYmUocmVkdWNlckZ1bmN0aW9uKSB7XG4gICAgdGhpcy5saXN0ZW5lciA9IHJlZHVjZXJGdW5jdGlvbjtcbiAgICB0aGlzLmluaXQoKS50aGVuKCgpID0+IGNvbnNvbGUubG9nKFwiaGlcIikpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lbnVNb2RlbDtcbiIsImltcG9ydCBJdGVtVUkgZnJvbSBcIi4vSXRlbVVJXCI7XG5cbmNvbnN0ICQgPSBJdGVtVUkuY3JlYXRlO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVy0JzQvmRhbENhcnQodGFyZ2V0Q2FydCwgdXBkYXRlUHJpY2UpIHtcbiAgaWYgKCF0YXJnZXRDYXJ0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbW9kYWxDb21wb25lbnQgPSAkKFxuICAgIFwiZGlhbG9nLm1vZGFsLWNhcnRcIixcbiAgICB7XG4gICAgICBldmVudHM6IHtcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGV2ZW50LmN1cnJlbnRUYXJnZXQpIHtcbiAgICAgICAgICAgIG1vZGFsQ29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgW1xuICAgICAgJChcIi5tb2RhbC1pbWcucHJldmlldy1ib3hcIiwgW1xuICAgICAgICAkKFwiLnByZXZpZXctaW1nLXdyYXBwZXJcIiwgW1xuICAgICAgICAgICQoXCJpbWcuY2FydC1pbWdcIiwge1xuICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgc3JjOiBgaW1hZ2VzLyR7dGFyZ2V0Q2FydC5jYXRlZ29yeX0tJHt0YXJnZXRDYXJ0LmlkfS5wbmdgLFxuICAgICAgICAgICAgICBhbHQ6IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdKSxcbiAgICAgIF0pLFxuICAgICAgJChcIi5tb2RhbC1jb250ZW50XCIsIFtcbiAgICAgICAgJChcIi5jb250ZW50LXByb2R1Y3QtaXRlbVwiLCBbXG4gICAgICAgICAgJChcImgyLnRpdGxlXCIsIHRhcmdldENhcnQubmFtZSksXG4gICAgICAgICAgJChcInAuZGVzY3JpcHRpb24tcHJvZHVjdC1pdGVtXCIsIHRhcmdldENhcnQuZGVzY3JpcHRpb24pLFxuICAgICAgICBdKSxcbiAgICAgICAgJChcIi5zaXplc1wiLCBbXG4gICAgICAgICAgJChcInAuc2l6ZXMtdGl0bGVcIiwgXCJTaXplXCIpLFxuICAgICAgICAgICQoXG4gICAgICAgICAgICBcIi5zaXplcy1yYWRpby13cmFwcGVyXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGV2ZW50czogeyBjaGFuZ2U6IHVwZGF0ZVByaWNlIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlU2l6ZXNJbnB1dHModGFyZ2V0Q2FydC5nZXRTaXplcyksXG4gICAgICAgICAgKSxcbiAgICAgICAgXSksXG4gICAgICAgICQoXCIuYWRkaXRpdmVzXCIsIFtcbiAgICAgICAgICAkKFwicC5hZGRpdGl2ZXMtdGl0bGVcIiwgXCJBZGRpdGl2ZXNcIiksXG4gICAgICAgICAgJChcbiAgICAgICAgICAgIFwiLmFkZGl0aXZlcy1jaGVja2JveC13cmFwcGVyXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGV2ZW50czogeyBjaGFuZ2U6IHVwZGF0ZVByaWNlIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlQWRkaXRpdmVzSW5wdXRzKHRhcmdldENhcnQuYWRkaXRpdmVzKSxcbiAgICAgICAgICApLFxuICAgICAgICBdKSxcbiAgICAgICAgJChcIi50b3RhbC13cmFwcGVyXCIsIFtcbiAgICAgICAgICAkKFwiLnRvdGFsLXRleHRcIiwgXCJUb3RhbDpcIiksXG4gICAgICAgICAgJChcInAudG90YWwtcHJpY2VcIiwgYCR7dGFyZ2V0Q2FydC5wcmljZX0gJGApLFxuICAgICAgICBdKSxcbiAgICAgICAgJChcIi5hbGVydFwiLCBbXG4gICAgICAgICAgJChcImltZy5pbmZvLWltZ1wiLCB7XG4gICAgICAgICAgICBhdHRyczogeyBzcmM6IFwiaW1hZ2VzL2luZm8tZW1wdHkuc3ZnXCIsIGFsdDogXCJcIiB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICAgICQoXG4gICAgICAgICAgICBcInAuYWxlcnQtaW5mby1jb3N0XCIsXG4gICAgICAgICAgICBcIlRoZSBjb3N0IGlzIG5vdCBmaW5hbC4gRG93bmxvYWQgb3VyIG1vYmlsZSBhcHAgdG8gc2VlIHRoZSBmaW5hbCBwcmljZSBhbmQgcGxhY2UgeW91ciBvcmRlci4gRWFybiBsb3lhbHR5IHBvaW50cyBhbmQgZW5qb3kgeW91ciBmYXZvcml0ZSBjb2ZmZWUgd2l0aCB1cCB0byAyMCUgZGlzY291bnQuXCIsXG4gICAgICAgICAgKSxcbiAgICAgICAgXSksXG4gICAgICAgICQoXCJidXR0b24uYnV0dG9uLTMubW9kYWwtY2xvc2UtYnV0dG9uXCIsIHtcbiAgICAgICAgICB0ZXh0OiBcIkNsb3NlXCIsXG4gICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICBjbGljazogKCkgPT4gbW9kYWxDb21wb25lbnQuZGVzdHJveSgpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSksXG4gICAgXSxcbiAgKTtcblxuICByZXR1cm4gbW9kYWxDb21wb25lbnQudWlFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTaXplc0lucHV0cyhzaXplcyA9IG5ldyBNYXAoKSkge1xuICBsZXQgaW5uZXJJbnB1dHMgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcblxuICBzaXplcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgbGV0IGlzRmlyc3QgPSBpbmRleCA9PT0gMDtcbiAgICBjb25zdCBpbnB1dCA9ICQoXCJsYWJlbC50YWItc2l6ZVwiLCB7fSwgW1xuICAgICAgJChcInNwYW4uaWNvbi50ZXh0LXdyYXBwZXItN1wiLCBrZXkpLFxuICAgICAgJChcImlucHV0LnNpemUtaW5wdXRcIiwge1xuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIHR5cGU6IFwicmFkaW9cIixcbiAgICAgICAgICBuYW1lOiBcInNpemVzXCIsXG4gICAgICAgICAgLi4uKGlzRmlyc3QgJiYgeyBjaGVja2VkOiBcInRydWVcIiB9KSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWU6IGtleSxcbiAgICAgIH0pLFxuICAgICAgJChcInNwYW4udGV4dC13cmFwcGVyLTdcIiwgdmFsdWUuc2l6ZSksXG4gICAgXSk7XG5cbiAgICBpbm5lcklucHV0cy5wdXNoKGlucHV0KTtcbiAgICBpbmRleCArPSAxO1xuICB9KTtcblxuICByZXR1cm4gaW5uZXJJbnB1dHM7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFkZGl0aXZlc0lucHV0cyhhZGRpdGl2ZXMgPSBbXSkge1xuICBsZXQgaW5uZXJJbnB1dHMgPSBbXTtcblxuICBhZGRpdGl2ZXMuZm9yRWFjaCgoYWRkaXRpdmUsIGkpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9ICQoXCJsYWJlbC50YWItYWRkaXRpdmVcIiwge30sIFtcbiAgICAgICQoXCJzcGFuLmljb24udGV4dC13cmFwcGVyLTdcIiwgaSArIDEpLFxuICAgICAgJChcImlucHV0LmFkZGl0aXZlLWlucHV0XCIsIHtcbiAgICAgICAgYXR0cnM6IHsgdHlwZTogXCJjaGVja2JveFwiLCBuYW1lOiBcImFkZGl0aXZlc1wiIH0sXG4gICAgICAgIHZhbHVlOiBhZGRpdGl2ZS5uYW1lLFxuICAgICAgfSksXG4gICAgICAkKFwic3Bhbi50ZXh0LXdyYXBwZXItN1wiLCBhZGRpdGl2ZS5uYW1lKSxcbiAgICBdKTtcbiAgICBpbm5lcklucHV0cy5wdXNoKGlucHV0KTtcbiAgICBpICs9IDE7XG4gIH0pO1xuXG4gIHJldHVybiBpbm5lcklucHV0cztcbn1cbiIsImV4cG9ydCBjb25zdCBTVEFSVF9DQVRFR09SWSA9IFwiY29mZmVlXCI7IC8vINC40LvQuCBcInRlYVwiLCDRgdC80L7RgtGA0Y8g0YfRgtC+INGDINCy0LDRgSDQv9C+INC00LXRhNC+0LvRgtGDXG5leHBvcnQgY29uc3QgUEFHRV9TSVpFXzc2OCA9IDQ7XG5cbmV4cG9ydCBjb25zdCBkZWxheSA9IChtcykgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMb2NrKGZuLCBkZWxheSA9IDUwMCkge1xuICBsZXQgaXNMb2NrZWQgPSBmYWxzZTtcblxuICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBpZiAoaXNMb2NrZWQpIHJldHVybjsgLy8g0JXRgdC70Lgg0YHRgtC+0LjRgiDQt9Cw0LzQvtC6IOKAlCDQuNCz0L3QvtGA0LjRgNGD0LXQvCDQutC70LjQulxuXG4gICAgaXNMb2NrZWQgPSB0cnVlO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpc0xvY2tlZCA9IGZhbHNlO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbmNvbnN0IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0Y29uc3QgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdGNvbnN0IG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHRjb25zdCBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsImNvbnN0IGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xubGV0IGxlYWZQcm90b3R5cGVzO1xuLy8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4vLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbi8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuLy8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4vLyBtb2RlICYgMTY6IHJldHVybiB2YWx1ZSB3aGVuIGl0J3MgUHJvbWlzZS1saWtlXG4vLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuXHRpZihtb2RlICYgMSkgdmFsdWUgPSB0aGlzKHZhbHVlKTtcblx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcblx0aWYodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSkge1xuXHRcdGlmKChtb2RlICYgNCkgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuXHRcdGlmKChtb2RlICYgMTYpICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nKSByZXR1cm4gdmFsdWU7XG5cdH1cblx0Y29uc3QgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuXHRjb25zdCBkZWYgPSB7fTtcblx0bGVhZlByb3RvdHlwZXMgPSBsZWFmUHJvdG90eXBlcyB8fCBbbnVsbCwgZ2V0UHJvdG8oe30pLCBnZXRQcm90byhbXSksIGdldFByb3RvKGdldFByb3RvKV07XG5cdGZvcih2YXIgY3VycmVudCA9IG1vZGUgJiAyICYmIHZhbHVlOyAodHlwZW9mIGN1cnJlbnQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIGN1cnJlbnQgPT0gJ2Z1bmN0aW9uJykgJiYgIX5sZWFmUHJvdG90eXBlcy5pbmRleE9mKGN1cnJlbnQpOyBjdXJyZW50ID0gZ2V0UHJvdG8oY3VycmVudCkpIHtcblx0XHRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjdXJyZW50KS5mb3JFYWNoKChrZXkpID0+IChkZWZba2V5XSA9ICgpID0+ICh2YWx1ZVtrZXldKSkpO1xuXHR9XG5cdGRlZlsnZGVmYXVsdCddID0gKCkgPT4gKHZhbHVlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBkZWYpO1xuXHRyZXR1cm4gbnM7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIvdmFsdWUgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZiA9IHt9O1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuLy8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoY2h1bmtJZCkgPT4ge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5mKS5yZWR1Y2UoKHByb21pc2VzLCBrZXkpID0+IHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmZba2V5XShjaHVua0lkLCBwcm9taXNlcyk7XG5cdFx0cmV0dXJuIHByb21pc2VzO1xuXHR9LCBbXSkpO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18udSA9IChjaHVua0lkKSA9PiAoXCJqcy9cIiArIGNodW5rSWQgKyBcIi5cIiArIFwiZTFhNGZlN2YwOTk3ZDM5MGQ4NTNcIiArIFwiLmpzXCIpOyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFsbCBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18ubWluaUNzc0YgPSAoY2h1bmtJZCkgPT4gKHVuZGVmaW5lZCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpOyIsImNvbnN0IGluUHJvZ3Jlc3MgPSB7fTtcbi8vIGRhdGEtd2VicGFjayBpcyBub3QgdXNlZCBhcyBidWlsZCBoYXMgbm8gdW5pcXVlTmFtZVxuLy8gbG9hZFNjcmlwdCBmdW5jdGlvbiB0byBsb2FkIGEgc2NyaXB0IHZpYSBzY3JpcHQgdGFnXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmwgPSAodXJsLCBkb25lLCBrZXksIGNodW5rSWQpID0+IHtcblx0aWYoaW5Qcm9ncmVzc1t1cmxdKSB7IGluUHJvZ3Jlc3NbdXJsXS5wdXNoKGRvbmUpOyByZXR1cm47IH1cblx0bGV0IHNjcmlwdCwgbmVlZEF0dGFjaDtcblx0aWYoa2V5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRjb25zdCBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHNjcmlwdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHMgPSBzY3JpcHRzW2ldO1xuXHRcdFx0aWYocy5nZXRBdHRyaWJ1dGUoXCJzcmNcIikgPT0gdXJsKSB7IHNjcmlwdCA9IHM7IGJyZWFrOyB9XG5cdFx0fVxuXHR9XG5cdGlmKCFzY3JpcHQpIHtcblx0XHRuZWVkQXR0YWNoID0gdHJ1ZTtcblx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblxuXHRcdHNjcmlwdC5jaGFyc2V0ID0gJ3V0Zi04Jztcblx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5uYykge1xuXHRcdFx0c2NyaXB0LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIF9fd2VicGFja19yZXF1aXJlX18ubmMpO1xuXHRcdH1cblxuXG5cdFx0c2NyaXB0LnNyYyA9IHVybDtcblx0fVxuXHRpblByb2dyZXNzW3VybF0gPSBbZG9uZV07XG5cdGNvbnN0IG9uU2NyaXB0Q29tcGxldGUgPSAocHJldiwgZXZlbnQpID0+IHtcblx0XHQvLyBhdm9pZCBtZW0gbGVha3MgaW4gSUUuXG5cdFx0c2NyaXB0Lm9uZXJyb3IgPSBzY3JpcHQub25sb2FkID0gbnVsbDtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0Y29uc3QgZG9uZUZucyA9IGluUHJvZ3Jlc3NbdXJsXTtcblx0XHRkZWxldGUgaW5Qcm9ncmVzc1t1cmxdO1xuXHRcdHNjcmlwdC5wYXJlbnROb2RlICYmIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG5cdFx0ZG9uZUZucyAmJiBkb25lRm5zLmZvckVhY2goKGZuKSA9PiAoZm4oZXZlbnQpKSk7XG5cdFx0aWYocHJldikgcmV0dXJuIHByZXYoZXZlbnQpO1xuXHR9XG5cdGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KG9uU2NyaXB0Q29tcGxldGUuYmluZChudWxsLCB1bmRlZmluZWQsIHsgdHlwZTogJ3RpbWVvdXQnLCB0YXJnZXQ6IHNjcmlwdCB9KSwgMTIwMDAwKTtcblx0c2NyaXB0Lm9uZXJyb3IgPSBvblNjcmlwdENvbXBsZXRlLmJpbmQobnVsbCwgc2NyaXB0Lm9uZXJyb3IpO1xuXHRzY3JpcHQub25sb2FkID0gb25TY3JpcHRDb21wbGV0ZS5iaW5kKG51bGwsIHNjcmlwdC5vbmxvYWQpO1xuXHRuZWVkQXR0YWNoICYmIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn07IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImxldCBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG5jb25zdCBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0ICYmIGRvY3VtZW50LmN1cnJlbnRTY3JpcHQudGFnTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnU0NSSVBUJylcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHRjb25zdCBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdGxldCBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAoIXNjcmlwdFVybCB8fCAhL15odHRwcz86Ly50ZXN0KHNjcmlwdFVybCkpKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC9eYmxvYjp8Wz8jXS4qJC9nLCBcIlwiKS5yZXBsYWNlKC9cXC9bXi9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmwgKyBcIi4uL1wiOyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG5jb25zdCBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwicDJcIjogMFxufTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5mLmogPSAoY2h1bmtJZCwgcHJvbWlzZXMpID0+IHtcblx0XHQvLyBKU09OUCBjaHVuayBsb2FkaW5nIGZvciBqYXZhc2NyaXB0XG5cdFx0bGV0IGluc3RhbGxlZENodW5rRGF0YSA9IF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpID8gaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdIDogdW5kZWZpbmVkO1xuXHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSAhPT0gMCkgeyAvLyAwIG1lYW5zIFwiYWxyZWFkeSBpbnN0YWxsZWRcIi5cblxuXHRcdFx0Ly8gYSBQcm9taXNlIG1lYW5zIFwiY3VycmVudGx5IGxvYWRpbmdcIi5cblx0XHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSkge1xuXHRcdFx0XHRwcm9taXNlcy5wdXNoKGluc3RhbGxlZENodW5rRGF0YVsyXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZih0cnVlKSB7IC8vIGFsbCBjaHVua3MgaGF2ZSBKU1xuXHRcdFx0XHRcdC8vIHNldHVwIFByb21pc2UgaW4gY2h1bmsgY2FjaGVcblx0XHRcdFx0XHRjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gKGluc3RhbGxlZENodW5rRGF0YSA9IGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IFtyZXNvbHZlLCByZWplY3RdKSk7XG5cdFx0XHRcdFx0cHJvbWlzZXMucHVzaChpbnN0YWxsZWRDaHVua0RhdGFbMl0gPSBwcm9taXNlKTtcblxuXHRcdFx0XHRcdC8vIGNyZWF0ZSBlcnJvciBiZWZvcmUgc3RhY2sgdW53b3VuZCB0byBnZXQgdXNlZnVsIHN0YWNrdHJhY2UgbGF0ZXJcblx0XHRcdFx0XHRjb25zdCBlcnJvciA9IG5ldyBFcnJvcigpO1xuXHRcdFx0XHRcdGNvbnN0IGxvYWRpbmdFbmRlZCA9IChldmVudCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkpIHtcblx0XHRcdFx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtEYXRhID0gaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuXHRcdFx0XHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua0RhdGEgIT09IDApIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgZXJyb3JUeXBlID0gZXZlbnQgJiYgKGV2ZW50LnR5cGUgPT09ICdsb2FkJyA/ICdtaXNzaW5nJyA6IGV2ZW50LnR5cGUpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHJlYWxTcmMgPSBldmVudCAmJiBldmVudC50YXJnZXQgJiYgZXZlbnQudGFyZ2V0LnNyYztcblx0XHRcdFx0XHRcdFx0XHRlcnJvci5tZXNzYWdlID0gJ0xvYWRpbmcgY2h1bmsgJyArIGNodW5rSWQgKyAnIGZhaWxlZC5cXG4oJyArIGVycm9yVHlwZSArICc6ICcgKyByZWFsU3JjICsgJyknO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9yLm5hbWUgPSAnQ2h1bmtMb2FkRXJyb3InO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9yLnR5cGUgPSBlcnJvclR5cGU7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IucmVxdWVzdCA9IHJlYWxTcmM7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IuZXZlbnQgPSBldmVudDtcblx0XHRcdFx0XHRcdFx0XHRpbnN0YWxsZWRDaHVua0RhdGFbMV0oZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmwoX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgX193ZWJwYWNrX3JlcXVpcmVfXy51KGNodW5rSWQpLCBsb2FkaW5nRW5kZWQsIFwiY2h1bmstXCIgKyBjaHVua0lkLCBjaHVua0lkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cbn07XG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG5jb25zdCB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHRsZXQgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblxufVxuXG5jb25zdCBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rXCJdID0gc2VsZltcIndlYnBhY2tDaHVua1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiaW1wb3J0IHsgZGVsYXksIFBBR0VfU0laRV83NjgsIHdpdGhMb2NrIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgTWVudU1vZGVsIGZyb20gXCIuL01lbnVNb2RlbFwiO1xuaW1wb3J0IHsgcmVuZGVy0JzQvmRhbENhcnQgfSBmcm9tIFwiLi9Nb2RhbENhcnRVSVwiO1xuXG5jb25zdCBtZWRpYVF1ZXJ5ID0gd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIik7XG5cbmNvbnN0IGxpZ2h0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saWdodFwiKTtcbmNvbnN0IGRhcmtCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRhcmtcIik7XG5jb25zdCBncmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ncmlkXCIpO1xuY29uc3QgaXRlbVByZXZpZXcgPSBncmlkLnF1ZXJ5U2VsZWN0b3IoXCIucHJldmlld1wiKTtcbmNvbnN0IHJlZnJlc2hCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ1dHRvbi1yZWZyZXNoXCIpO1xuXG5jb25zdCBjcmVhdGVJbWFnZSA9IChzcmMpID0+XG4gIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgIGltZy5vbmxvYWQgPSAoKSA9PiByZXMoaW1nKTtcbiAgICBpbWcub25lcnJvciA9IHJlajtcbiAgICBpbWcuc3JjID0gc3JjO1xuICB9KTtcblxuY29uc3QgbWVudU1vZGVsID0gbmV3IE1lbnVNb2RlbCgpO1xuaWYgKG1lZGlhUXVlcnkubWF0Y2hlcykge1xuICBtZW51TW9kZWwucGFnZVNpemUgPSBQQUdFX1NJWkVfNzY4O1xufVxuXG5jb25zdCB1cGRhdGVQcmljZSA9ICgpID0+IHtcbiAgbGV0IHNlbGVjdEFkZGl0aXZlcyA9IFtdO1xuICBjb25zdCBhZGRpdGl2ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFkZGl0aXZlLWlucHV0OmNoZWNrZWRcIik7XG4gIGFkZGl0aXZlcy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIHNlbGVjdEFkZGl0aXZlcy5wdXNoKGlucHV0LnZhbHVlKTtcbiAgfSk7XG5cbiAgY29uc3Qgc2l6ZVZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaXplLWlucHV0OmNoZWNrZWRcIikudmFsdWU7XG4gIG1lbnVNb2RlbC5jYWxjUHJpY2Uoc2l6ZVZhbHVlLCBzZWxlY3RBZGRpdGl2ZXMpO1xufTtcblxubWVudU1vZGVsLnN1YnNjcmliZShzdGF0ZVJlZHVjZXIpO1xuXG5jb25zdCB0YWJzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YWJzXCIpO1xuXG5hc3luYyBmdW5jdGlvbiByZW5kZXIoKSB7XG4gIG1lZGlhUXVlcnkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBoYW5kbGVTY3JlZW5DaGFuZ2UpO1xuICBoYW5kbGVTY3JlZW5DaGFuZ2UobWVkaWFRdWVyeSk7XG5cbiAgZGFya0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgbWVudU1vZGVsLnNldFRoZW1lKHRydWUpO1xuICB9KTtcblxuICBsaWdodEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgbWVudU1vZGVsLnNldFRoZW1lKCk7XG4gIH0pO1xuXG4gIHRhYnNDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGNsaWNrZWRUYWIgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi50YWItaXRlbVwiKTtcbiAgICBpZiAoIWNsaWNrZWRUYWIgfHwgY2xpY2tlZFRhYi5nZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIpID09PSBcInRydWVcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdDYXRlZ29yeSA9IGNsaWNrZWRUYWIuZGF0YXNldC5jYXRlZ29yeTtcbiAgICB1cGRhdGVDYXRlZ29yeShuZXdDYXRlZ29yeSk7XG4gICAgbWVudU1vZGVsLmdldEZpbHRlclByb2R1Y3QobmV3Q2F0ZWdvcnkpO1xuICB9KTtcblxuICByZWZyZXNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgXCJjbGlja1wiLFxuICAgIHdpdGhMb2NrKCgpID0+IHtcbiAgICAgIG1lbnVNb2RlbC5nZXROZXh0UGFnZSgpO1xuICAgIH0sIDQwMCksXG4gICk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNjcmVlbkNoYW5nZShldmVudCkge1xuICBpZiAoZXZlbnQubWF0Y2hlcykge1xuICAgIG1lbnVNb2RlbC5wYWdlU2l6ZSA9IFBBR0VfU0laRV83Njg7XG4gIH0gZWxzZSB7XG4gICAgbWVudU1vZGVsLnBhZ2VTaXplID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlckl0ZW1QcmV2aWV3KHByb2R1Y3QsIGl0ZW0gPSB1bmRlZmluZWQpIHtcbiAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0gPSBpdGVtUHJldmlldy5jbG9uZU5vZGUodHJ1ZSk7XG4gIH1cblxuICBsZXQgaW1nID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiLmJveC1wcm9kdWN0LWl0ZW1cIik7XG4gIGxldCB0aXRsZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcihcIi50aXRsZVwiKTtcbiAgbGV0IGRlc2NyaXB0aW9uID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uLXByb2R1Y3QtaXRlbVwiKTtcbiAgbGV0IHByaWNlID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiLnByaWNlXCIpO1xuICB0aXRsZS50ZXh0Q29udGVudCA9IHByb2R1Y3QubmFtZTtcbiAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSBwcm9kdWN0LmRlc2NyaXB0aW9uO1xuICBwcmljZS50ZXh0Q29udGVudCA9IFwiJFwiICsgcHJvZHVjdC5wcmljZTtcbiAgY29uc3QgaW1hZ2VTcmMgPSBgaW1hZ2VzLyR7cHJvZHVjdC5jYXRlZ29yeX0tJHtwcm9kdWN0LmlkfS5wbmdgO1xuICB0cnkge1xuICAgIGNvbnN0IG5ld0ltZyA9IGF3YWl0IGNyZWF0ZUltYWdlKGltYWdlU3JjKTtcbiAgICBuZXdJbWcuY2xhc3NMaXN0LmFkZChcImJveC1wcm9kdWN0LWl0ZW1cIik7XG4gICAgaWYgKGltZykge1xuICAgICAgaW1nLnJlcGxhY2VXaXRoKG5ld0ltZyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICBg0J3QtSDRg9C00LDQu9C+0YHRjCDQt9Cw0LPRgNGD0LfQuNGC0Ywg0LrQsNGA0YLQuNC90LrRgyDQtNC70Y8g0YLQvtCy0LDRgNCwICR7cHJvZHVjdC5uYW1lfTpgLFxuICAgICAgZXJyb3IsXG4gICAgKTtcbiAgfVxuICBpdGVtLmRhdGFzZXQuY2F0ZWdvcnkgPSBwcm9kdWN0LmNhdGVnb3J5O1xuICBpdGVtLmlkID0gYHByb2R1Y3QtMCR7cHJvZHVjdC5pZH1gO1xuICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJmYWRlLWluXCIsIFwiZmFkZS1vdXRcIik7XG5cbiAgY29uc3QgaGFuZGxlQ2FyZENsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0SWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmlkO1xuICAgIG1lbnVNb2RlbC5nZXRNb2RhbCh0YXJnZXRJZCk7XG4gIH07XG4gIGl0ZW0ub25jbGljayA9IGhhbmRsZUNhcmRDbGljaztcblxuICByZXR1cm4gaXRlbTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVuZGVyQ2FydHMoYW5zd2VyKSB7XG4gIGNvbnN0IGRhdGEgPSBhbnN3ZXIuZGF0YTtcbiAgY29uc3QgcHJvZHVjdHMgPSBkYXRhLml0ZW1zO1xuICBwcm9kdWN0cy5mb3JFYWNoKGFzeW5jIGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgbGV0IG5ld0l0ZW0gPSBhd2FpdCByZW5kZXJJdGVtUHJldmlldyhwcm9kdWN0KTtcbiAgICBncmlkLmFwcGVuZENoaWxkKG5ld0l0ZW0pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbmV3SXRlbS5jbGFzc0xpc3QuYWRkKFwiZmFkZS1pblwiKTtcbiAgICB9LCA1MCk7XG4gIH0pO1xuXG4gIGlmIChkYXRhLmZpbmlzaCkge1xuICAgIHJlZnJlc2hCdXR0b24uY2xhc3NMaXN0LmFkZChcImZhZGUtb3V0XCIpO1xuICB9IGVsc2Uge1xuICAgIHJlZnJlc2hCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImZhZGUtb3V0XCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXRlUmVkdWNlcihhY3Rpb25UeXBlLCBwYXlsb2FkKSB7XG4gIHN3aXRjaCAoYWN0aW9uVHlwZSkge1xuICAgIGNhc2UgXCJjdXJyZW50Q2F0ZWdvcnlcIjpcbiAgICAgIHVwZGF0ZUNhdGVnb3J5TGF5b3V0KHBheWxvYWQpLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJyZW1vdmVDYXJ0c1RvQ291bnRcIjpcbiAgICAgIHJlbW92ZUNhcnRzKHBheWxvYWQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiYWRkQ2FydHNcIjpcbiAgICAgIHJlbmRlckNhcnRzKHBheWxvYWQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwidGhlbWVcIjpcbiAgICAgIHN3aXRjaFRoZW1lKHBheWxvYWQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwibW9kYWxcIjpcbiAgICAgIHJlbmRlctCc0L5kYWwocGF5bG9hZCkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImNhbGNQcmljZVwiOlxuICAgICAgdXBkYXRlUHJpY2VPblNjcmVlbihwYXlsb2FkKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbnNvbGUubG9nKGDQodC+0LHRi9GC0LjQtSAke2FjdGlvblR5cGV9INC90LUg0LLQu9C40Y/QtdGCINC90LAgRE9NINGN0YLQvtC5INGB0YLRgNCw0L3QuNGG0YtgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzd2l0Y2hUaGVtZShkYXRhVGhlbWUpIHtcbiAgaWYgKGRhdGFUaGVtZSkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwiZGFya1wiKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS10aGVtZVwiKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiByZW5kZXLQnNC+ZGFsKGFuc3dlcikge1xuICBjb25zdCBtb2RhbENhcnQgPSByZW5kZXLQnNC+ZGFsQ2FydChhbnN3ZXIuZGF0YSwgdXBkYXRlUHJpY2UpO1xuICBpZiAobW9kYWxDYXJ0IGluc3RhbmNlb2YgSFRNTERpYWxvZ0VsZW1lbnQpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmQtbWVudVwiKS5hcHBlbmRDaGlsZChtb2RhbENhcnQpO1xuICAgIG1vZGFsQ2FydC5zaG93TW9kYWwoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVQcmljZU9uU2NyZWVuKGFuc3dlcikge1xuICBjb25zdCBmaW5hbFByaWNlID0gYW5zd2VyLmRhdGE7XG4gIGNvbnN0IHRvdGFsUHJpY2VFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1wcmljZVwiKTtcbiAgaWYgKCF0b3RhbFByaWNlRWxlbWVudCkgcmV0dXJuO1xuICB0b3RhbFByaWNlRWxlbWVudC50ZXh0Q29udGVudCA9IGAke2ZpbmFsUHJpY2UudG9GaXhlZCgyKX0gJGA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNhdGVnb3J5TGF5b3V0KGFuc3dlcikge1xuICBjb25zdCBjaGVja2VkQ2F0ZWdvcnkgPSB0YWJzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgXCIudGFiLWl0ZW1bYXJpYS1zZWxlY3RlZD0ndHJ1ZSddXCIsXG4gICkuZGF0YXNldC5jYXRlZ29yeTtcbiAgY29uc3QgY3VycmVudENhdGVnb3J5ID0gbWVudU1vZGVsLmN1cnJlbnRDYXRlZ29yeTtcbiAgaWYgKGNoZWNrZWRDYXRlZ29yeSAhPT0gY3VycmVudENhdGVnb3J5KSB7XG4gICAgdXBkYXRlQ2F0ZWdvcnkoY3VycmVudENhdGVnb3J5KTtcbiAgfVxuICByZW1vdmVDYXJ0cygpO1xuICBhd2FpdCByZW5kZXJDYXJ0cyhhbnN3ZXIpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDYXJ0cyhhbnN3ZXIgPSB1bmRlZmluZWQpIHtcbiAgY29uc3QgcHJldmlld3NMaXN0ID0gZ3JpZC5xdWVyeVNlbGVjdG9yQWxsKFwiLnByZXZpZXdcIik7XG4gIGxldCBwcmV2aWV3cyA9IFsuLi5wcmV2aWV3c0xpc3RdO1xuXG4gIHByZXZpZXdzLnJldmVyc2UoKTtcbiAgaWYgKGFuc3dlcikge1xuICAgIHByZXZpZXdzLnNwbGljZShhbnN3ZXIuZGF0YSAqIC0xKTtcbiAgICByZWZyZXNoQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYWRlLW91dFwiKTtcbiAgfVxuXG4gIHByZXZpZXdzLmZvckVhY2goYXN5bmMgKGNhcmQpID0+IHtcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJmYWRlLW91dFwiKTtcbiAgICBhd2FpdCBkZWxheSgzMDApO1xuICAgIGNhcmQucmVtb3ZlKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDYXRlZ29yeShjYXRlZ29yeSkge1xuICBjb25zdCBhbGxUYWJzID0gdGFic0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLnRhYi1pdGVtXCIpO1xuICBhbGxUYWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgIGlmICh0YWIuZGF0YXNldC5jYXRlZ29yeSA9PT0gY2F0ZWdvcnkpIHtcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIFwidHJ1ZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFiLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgXCJmYWxzZVwiKTtcbiAgICB9XG4gIH0pO1xufVxuXG5yZW5kZXIoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==