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

/***/ "./Slider.js"
/*!*******************!*\
  !*** ./Slider.js ***!
  \*******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Slider {
  constructor(
    wrapper,
    slides,
    listContainer = undefined,
    tabs = undefined,
    rightTab = undefined,
    leftTab = undefined,
  ) {
    this.tabs = tabs;
    this.slides = slides;
    this.listContainer = listContainer;
    this.wrapper = wrapper;
    this.rightTab = rightTab;
    this.leftTab = leftTab;
    this.slideWidth = 0;
    this.init();
  }

  init() {
    this.createClones();
    this.updateDimensions();
    this.listContainer.style.scrollBehavior = "auto";
    this.listContainer.style.scrollSnapType = "none";
    this.listContainer.scrollLeft = this.slideWidth;

    requestAnimationFrame(() => {
      this.listContainer.style.scrollBehavior = "smooth";
      this.listContainer.style.scrollSnapType = "x mandatory";
    });

    this.bindEvents();
    this.initObserver();
  }

  createClones() {
    const firstClone = this.slides[0].cloneNode(true);
    const lastClone = this.slides[this.slides.length - 1].cloneNode(true);

    firstClone.dataset.isClone = "true";
    lastClone.dataset.isClone = "true";
    const list = this.listContainer ? this.listContainer : this.wrapper;
    list.appendChild(firstClone);
    list.insertBefore(lastClone, this.slides[0]);
  }

  updateDimensions() {
    this.slideWidth = this.wrapper.offsetWidth;
  }

  jumpTo(position) {
    this.isJumping = true;

    this.listContainer.style.scrollBehavior = "auto";
    this.listContainer.style.scrollSnapType = "none";

    this.listContainer.scrollLeft = position;

    requestAnimationFrame(() => {
      this.listContainer.style.scrollBehavior = "smooth";
      this.listContainer.style.scrollSnapType = "x mandatory";
      this.isJumping = false;
    });
  }

  bindEvents() {
    this.onScrollHandler = this.handleScroll.bind(this);
    this.onResizeHandler = this.updateDimensions.bind(this);

    this.listContainer.addEventListener("scroll", this.onScrollHandler);
    window.addEventListener("resize", this.onResizeHandler);

    if (this.tabs) {
      this.onTabClickHandler = this.handleTabClick.bind(this);
      this.tabs.forEach((tab) => {
        tab.addEventListener("click", this.onTabClickHandler);
      });
    }

    if (this.rightTab) {
      this.onRightTab = this.next.bind(this);
      this.rightTab.addEventListener("click", this.onRightTab);
    }

    if (this.leftTab) {
      this.onLeftTab = this.prev.bind(this);
      this.leftTab.addEventListener("click", this.onLeftTab);
    }
  }

  handleScroll() {
    if (this.isJumping) return;

    const currentScroll = this.listContainer.scrollLeft;
    const maxScroll = this.slideWidth * (this.slides.length + 1);

    if (currentScroll >= maxScroll) {
      this.jumpTo(this.slideWidth);
    } else if (currentScroll <= 0) {
      this.jumpTo(this.slideWidth * this.slides.length);
    }
  }

  handleTabClick(event) {
    const clickedTab = event.target.closest(".control");
    if (!clickedTab) return;

    const targetIndex = parseInt(clickedTab.id.replace(/[^\d]/g, ""), 10);
    if (isNaN(targetIndex)) return;

    this.isProgrammaticScrolling = true;

    this.setActiveTab(targetIndex);
    if (this.listContainer) {
      this.listContainer.scrollLeft = targetIndex * this.slideWidth;
    }
    setTimeout(() => {
      this.isProgrammaticScrolling = false;
    }, 450);
  }

  setActiveTab(activeIndex) {
    this.tabs.forEach((tab) => {
      const tabIndex = parseInt(tab.id.replace(/[^\d]/g, ""), 10);
      tab.setAttribute(
        "aria-selected",
        tabIndex === activeIndex ? "true" : "false",
      );
    });
  }

  next() {
    this.listContainer.scrollLeft += this.slideWidth;
  }

  prev() {
    this.listContainer.scrollLeft -= this.slideWidth;
  }

  initObserver() {
    this.observerOptions = {
      root: this.listContainer,
      threshold: 0.6,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (this.isProgrammaticScrolling || this.isJumping) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.isClone) {
          const index = parseInt(entry.target.id.replace(/[^\d]/g, ""), 10);

          if (!isNaN(index)) {
            this.setActiveTab(index);
          }
        }
      });
    }, this.observerOptions);

    this.listContainer
      .querySelectorAll(".item-slider")
      .forEach((item) => this.observer.observe(item));
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Slider);


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
/************************************************************************/
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DataClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DataClient */ "./DataClient.js");
/* harmony import */ var _Slider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Slider */ "./Slider.js");



const lightButton = document.querySelector(".light");
const darkButton = document.querySelector(".dark");

const dataClient = new _DataClient__WEBPACK_IMPORTED_MODULE_0__["default"]();

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

const slider = new _Slider__WEBPACK_IMPORTED_MODULE_1__["default"](
  sliderWrapper,
  slides,
  sliderlist,
  sliderTabs,
  sliderRightTab,
  sliderLeftTab,
);

render();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvcDEuZTk4YWYyNmE2YmFjNWFjNzAxZWYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxlQUFlLEdBQUcsSUFBSTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixlQUFlLEdBQUcsSUFBSTtBQUNsRDtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsZUFBZSxHQUFHLElBQUk7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsVUFBVTs7Ozs7Ozs7Ozs7Ozs7O0FDcEJ6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7VUNyS3RCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUM1QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQSxFOzs7VUNQQSx5Rjs7O1VDQUE7VUFDQTtVQUNBLHNEQUFzRCxpQkFBaUI7VUFDdkUsZ0RBQWdELGFBQWE7VUFDN0QsRTs7Ozs7Ozs7Ozs7O0FDSnNDO0FBQ1I7O0FBRTlCO0FBQ0E7O0FBRUEsdUJBQXVCLG1EQUFVOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBLG1CQUFtQiwrQ0FBTTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL0RhdGFDbGllbnQuanMiLCJ3ZWJwYWNrOi8vLy4vU2xpZGVyLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5jbGFzcyBEYXRhQ2xpZW50IHtcclxuICBjb25zdHJ1Y3RvcihuYW1lc3BhY2UgPSBcImNvZmZlZS1ob3VzZVwiKSB7XHJcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGdldEl0ZW0oa2V5ID0gJycpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5uYW1lc3BhY2V9OiR7a2V5fWApO1xyXG4gICAgcmV0dXJuIHZhbHVlID8gSlNPTi5wYXJzZSh2YWx1ZSkgOiBudWxsO1xyXG4gIH1cclxuXHJcbiAgc2V0SXRlbShrZXkgPSAnJywgdmFsdWUgPSB1bmRlZmluZWQpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3RoaXMubmFtZXNwYWNlfToke2tleX1gLCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlSXRlbShrZXkgPSAnJykge1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYCR7dGhpcy5uYW1lc3BhY2V9OiR7a2V5fWApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0YUNsaWVudFxyXG4iLCJjbGFzcyBTbGlkZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICB3cmFwcGVyLFxuICAgIHNsaWRlcyxcbiAgICBsaXN0Q29udGFpbmVyID0gdW5kZWZpbmVkLFxuICAgIHRhYnMgPSB1bmRlZmluZWQsXG4gICAgcmlnaHRUYWIgPSB1bmRlZmluZWQsXG4gICAgbGVmdFRhYiA9IHVuZGVmaW5lZCxcbiAgKSB7XG4gICAgdGhpcy50YWJzID0gdGFicztcbiAgICB0aGlzLnNsaWRlcyA9IHNsaWRlcztcbiAgICB0aGlzLmxpc3RDb250YWluZXIgPSBsaXN0Q29udGFpbmVyO1xuICAgIHRoaXMud3JhcHBlciA9IHdyYXBwZXI7XG4gICAgdGhpcy5yaWdodFRhYiA9IHJpZ2h0VGFiO1xuICAgIHRoaXMubGVmdFRhYiA9IGxlZnRUYWI7XG4gICAgdGhpcy5zbGlkZVdpZHRoID0gMDtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jcmVhdGVDbG9uZXMoKTtcbiAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICB0aGlzLmxpc3RDb250YWluZXIuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSBcImF1dG9cIjtcbiAgICB0aGlzLmxpc3RDb250YWluZXIuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmxpc3RDb250YWluZXIuc2Nyb2xsTGVmdCA9IHRoaXMuc2xpZGVXaWR0aDtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLmxpc3RDb250YWluZXIuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSBcInNtb290aFwiO1xuICAgICAgdGhpcy5saXN0Q29udGFpbmVyLnN0eWxlLnNjcm9sbFNuYXBUeXBlID0gXCJ4IG1hbmRhdG9yeVwiO1xuICAgIH0pO1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy5pbml0T2JzZXJ2ZXIoKTtcbiAgfVxuXG4gIGNyZWF0ZUNsb25lcygpIHtcbiAgICBjb25zdCBmaXJzdENsb25lID0gdGhpcy5zbGlkZXNbMF0uY2xvbmVOb2RlKHRydWUpO1xuICAgIGNvbnN0IGxhc3RDbG9uZSA9IHRoaXMuc2xpZGVzW3RoaXMuc2xpZGVzLmxlbmd0aCAtIDFdLmNsb25lTm9kZSh0cnVlKTtcblxuICAgIGZpcnN0Q2xvbmUuZGF0YXNldC5pc0Nsb25lID0gXCJ0cnVlXCI7XG4gICAgbGFzdENsb25lLmRhdGFzZXQuaXNDbG9uZSA9IFwidHJ1ZVwiO1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmxpc3RDb250YWluZXIgPyB0aGlzLmxpc3RDb250YWluZXIgOiB0aGlzLndyYXBwZXI7XG4gICAgbGlzdC5hcHBlbmRDaGlsZChmaXJzdENsb25lKTtcbiAgICBsaXN0Lmluc2VydEJlZm9yZShsYXN0Q2xvbmUsIHRoaXMuc2xpZGVzWzBdKTtcbiAgfVxuXG4gIHVwZGF0ZURpbWVuc2lvbnMoKSB7XG4gICAgdGhpcy5zbGlkZVdpZHRoID0gdGhpcy53cmFwcGVyLm9mZnNldFdpZHRoO1xuICB9XG5cbiAganVtcFRvKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5pc0p1bXBpbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5saXN0Q29udGFpbmVyLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gXCJhdXRvXCI7XG4gICAgdGhpcy5saXN0Q29udGFpbmVyLnN0eWxlLnNjcm9sbFNuYXBUeXBlID0gXCJub25lXCI7XG5cbiAgICB0aGlzLmxpc3RDb250YWluZXIuc2Nyb2xsTGVmdCA9IHBvc2l0aW9uO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMubGlzdENvbnRhaW5lci5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IFwic21vb3RoXCI7XG4gICAgICB0aGlzLmxpc3RDb250YWluZXIuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSBcInggbWFuZGF0b3J5XCI7XG4gICAgICB0aGlzLmlzSnVtcGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLm9uU2Nyb2xsSGFuZGxlciA9IHRoaXMuaGFuZGxlU2Nyb2xsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblJlc2l6ZUhhbmRsZXIgPSB0aGlzLnVwZGF0ZURpbWVuc2lvbnMuYmluZCh0aGlzKTtcblxuICAgIHRoaXMubGlzdENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGxIYW5kbGVyKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLm9uUmVzaXplSGFuZGxlcik7XG5cbiAgICBpZiAodGhpcy50YWJzKSB7XG4gICAgICB0aGlzLm9uVGFiQ2xpY2tIYW5kbGVyID0gdGhpcy5oYW5kbGVUYWJDbGljay5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy50YWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25UYWJDbGlja0hhbmRsZXIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmlnaHRUYWIpIHtcbiAgICAgIHRoaXMub25SaWdodFRhYiA9IHRoaXMubmV4dC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5yaWdodFRhYi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vblJpZ2h0VGFiKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5sZWZ0VGFiKSB7XG4gICAgICB0aGlzLm9uTGVmdFRhYiA9IHRoaXMucHJldi5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5sZWZ0VGFiLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uTGVmdFRhYik7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU2Nyb2xsKCkge1xuICAgIGlmICh0aGlzLmlzSnVtcGluZykgcmV0dXJuO1xuXG4gICAgY29uc3QgY3VycmVudFNjcm9sbCA9IHRoaXMubGlzdENvbnRhaW5lci5zY3JvbGxMZWZ0O1xuICAgIGNvbnN0IG1heFNjcm9sbCA9IHRoaXMuc2xpZGVXaWR0aCAqICh0aGlzLnNsaWRlcy5sZW5ndGggKyAxKTtcblxuICAgIGlmIChjdXJyZW50U2Nyb2xsID49IG1heFNjcm9sbCkge1xuICAgICAgdGhpcy5qdW1wVG8odGhpcy5zbGlkZVdpZHRoKTtcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRTY3JvbGwgPD0gMCkge1xuICAgICAgdGhpcy5qdW1wVG8odGhpcy5zbGlkZVdpZHRoICogdGhpcy5zbGlkZXMubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVUYWJDbGljayhldmVudCkge1xuICAgIGNvbnN0IGNsaWNrZWRUYWIgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi5jb250cm9sXCIpO1xuICAgIGlmICghY2xpY2tlZFRhYikgcmV0dXJuO1xuXG4gICAgY29uc3QgdGFyZ2V0SW5kZXggPSBwYXJzZUludChjbGlja2VkVGFiLmlkLnJlcGxhY2UoL1teXFxkXS9nLCBcIlwiKSwgMTApO1xuICAgIGlmIChpc05hTih0YXJnZXRJbmRleCkpIHJldHVybjtcblxuICAgIHRoaXMuaXNQcm9ncmFtbWF0aWNTY3JvbGxpbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5zZXRBY3RpdmVUYWIodGFyZ2V0SW5kZXgpO1xuICAgIGlmICh0aGlzLmxpc3RDb250YWluZXIpIHtcbiAgICAgIHRoaXMubGlzdENvbnRhaW5lci5zY3JvbGxMZWZ0ID0gdGFyZ2V0SW5kZXggKiB0aGlzLnNsaWRlV2lkdGg7XG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pc1Byb2dyYW1tYXRpY1Njcm9sbGluZyA9IGZhbHNlO1xuICAgIH0sIDQ1MCk7XG4gIH1cblxuICBzZXRBY3RpdmVUYWIoYWN0aXZlSW5kZXgpIHtcbiAgICB0aGlzLnRhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICBjb25zdCB0YWJJbmRleCA9IHBhcnNlSW50KHRhYi5pZC5yZXBsYWNlKC9bXlxcZF0vZywgXCJcIiksIDEwKTtcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIFwiYXJpYS1zZWxlY3RlZFwiLFxuICAgICAgICB0YWJJbmRleCA9PT0gYWN0aXZlSW5kZXggPyBcInRydWVcIiA6IFwiZmFsc2VcIixcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBuZXh0KCkge1xuICAgIHRoaXMubGlzdENvbnRhaW5lci5zY3JvbGxMZWZ0ICs9IHRoaXMuc2xpZGVXaWR0aDtcbiAgfVxuXG4gIHByZXYoKSB7XG4gICAgdGhpcy5saXN0Q29udGFpbmVyLnNjcm9sbExlZnQgLT0gdGhpcy5zbGlkZVdpZHRoO1xuICB9XG5cbiAgaW5pdE9ic2VydmVyKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJPcHRpb25zID0ge1xuICAgICAgcm9vdDogdGhpcy5saXN0Q29udGFpbmVyLFxuICAgICAgdGhyZXNob2xkOiAwLjYsXG4gICAgfTtcblxuICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzUHJvZ3JhbW1hdGljU2Nyb2xsaW5nIHx8IHRoaXMuaXNKdW1waW5nKSByZXR1cm47XG5cbiAgICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nICYmICFlbnRyeS50YXJnZXQuZGF0YXNldC5pc0Nsb25lKSB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChlbnRyeS50YXJnZXQuaWQucmVwbGFjZSgvW15cXGRdL2csIFwiXCIpLCAxMCk7XG5cbiAgICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVUYWIoaW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwgdGhpcy5vYnNlcnZlck9wdGlvbnMpO1xuXG4gICAgdGhpcy5saXN0Q29udGFpbmVyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5pdGVtLXNsaWRlclwiKVxuICAgICAgLmZvckVhY2goKGl0ZW0pID0+IHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShpdGVtKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxuY29uc3QgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRjb25zdCBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0Y29uc3QgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdGNvbnN0IGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpOyIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgRGF0YUNsaWVudCBmcm9tIFwiLi9EYXRhQ2xpZW50XCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCIuL1NsaWRlclwiO1xuXG5jb25zdCBsaWdodEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlnaHRcIik7XG5jb25zdCBkYXJrQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXJrXCIpO1xuXG5jb25zdCBkYXRhQ2xpZW50ID0gbmV3IERhdGFDbGllbnQoKTtcblxuY29uc3Qgc2xpZGVyU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZC1zbGlkZXJcIik7XG5jb25zdCBzbGlkZXJXcmFwcGVyID0gc2xpZGVyU2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLnJvdy1zbGlkZXJcIik7XG5jb25zdCBzbGlkZXMgPSBzbGlkZXJTZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaXRlbS1zbGlkZXJcIik7XG5jb25zdCBzbGlkZXJsaXN0ID0gc2xpZGVyU2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlci1saXN0XCIpO1xuY29uc3Qgc2xpZGVyVGFicyA9IHNsaWRlclNlY3Rpb24ucXVlcnlTZWxlY3RvckFsbChcIi5jb250cm9sXCIpO1xuY29uc3Qgc2xpZGVyUmlnaHRUYWIgPSBzbGlkZXJTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIuYnV0dG9uLWljb24tcmlnaHRcIik7XG5jb25zdCBzbGlkZXJMZWZ0VGFiID0gc2xpZGVyU2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLmJ1dHRvbi1pY29uLWxlZnRcIik7XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgY29uc3QgZGF0YVRoZW1lID0gYXdhaXQgZGF0YUNsaWVudC5nZXRJdGVtKFwidGhlbWVcIik7XG4gIGlmIChkYXRhVGhlbWUpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcImRhcmtcIik7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIik7XG4gIH1cblxuICBkYXJrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcImRhcmtcIik7XG4gICAgZGF0YUNsaWVudC5zZXRJdGVtKFwidGhlbWVcIiwgdHJ1ZSk7XG4gIH0pO1xuXG4gIGxpZ2h0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS10aGVtZVwiKTtcbiAgICBkYXRhQ2xpZW50LnNldEl0ZW0oXCJ0aGVtZVwiLCBmYWxzZSk7XG4gIH0pO1xufVxuXG5jb25zdCBzbGlkZXIgPSBuZXcgU2xpZGVyKFxuICBzbGlkZXJXcmFwcGVyLFxuICBzbGlkZXMsXG4gIHNsaWRlcmxpc3QsXG4gIHNsaWRlclRhYnMsXG4gIHNsaWRlclJpZ2h0VGFiLFxuICBzbGlkZXJMZWZ0VGFiLFxuKTtcblxucmVuZGVyKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=