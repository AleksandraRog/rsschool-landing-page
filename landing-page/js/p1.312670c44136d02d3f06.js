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
    this.currentIndex = 0;
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
    this.initResizeObserver();
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
    let oldWidth = this.slideWidth;
    this.slideWidth = this.wrapper.offsetWidth;

    if (!oldWidth) {
      return;
    }

    const diff = this.slideWidth - oldWidth;
    this.listContainer.style.scrollBehavior = "auto";
    this.listContainer.style.scrollSnapType = "none";

    this.listContainer.scrollLeft += diff * this.currentIndex;

    requestAnimationFrame(() => {
      this.listContainer.style.scrollBehavior = "smooth";
      this.listContainer.style.scrollSnapType = "x mandatory";
    });
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
    // this.onResizeHandler = this.updateDimensions.bind(this);

    this.listContainer.addEventListener("scroll", this.onScrollHandler);
    //window.addEventListener("resize", this.onResizeHandler);

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
            this.currentIndex = index;
            this.setActiveTab(index);
          }
        }
      });
    }, this.observerOptions);

    this.listContainer
      .querySelectorAll(".item-slider")
      .forEach((item) => this.observer.observe(item));
  }

  initResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateDimensions();
    });

    this.resizeObserver.observe(this.wrapper);
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
/* harmony import */ var _BurgerMenu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BurgerMenu */ "./BurgerMenu.js");
/* harmony import */ var _DataClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DataClient */ "./DataClient.js");
/* harmony import */ var _Slider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Slider */ "./Slider.js");




const lightButton = document.querySelector(".light");
const darkButton = document.querySelector(".dark");

const dataClient = new _DataClient__WEBPACK_IMPORTED_MODULE_1__["default"]();

const sliderSection = document.querySelector(".d-slider");
const sliderWrapper = sliderSection.querySelector(".row-slider");
const slides = sliderSection.querySelectorAll(".item-slider");
const sliderlist = sliderSection.querySelector(".slider-list");
const sliderTabs = sliderSection.querySelectorAll(".control");
const sliderRightTab = sliderSection.querySelector(".button-icon-right");
const sliderLeftTab = sliderSection.querySelector(".button-icon-left");

const burgerButton = document.querySelector(".button-icon-burger");
const burgerAcide = document.querySelector(".burger-nav");

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

const slider = new _Slider__WEBPACK_IMPORTED_MODULE_2__["default"](
  sliderWrapper,
  slides,
  sliderlist,
  sliderTabs,
  sliderRightTab,
  sliderLeftTab,
);

const burgerMenu = new _BurgerMenu__WEBPACK_IMPORTED_MODULE_0__["default"](burgerButton, burgerAcide);

render();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFVOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsbUJBQW1CLCtDQUFNO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QixtREFBVTs7QUFFakMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9CdXJnZXJNZW51LmpzIiwid2VicGFjazovLy8uL0RhdGFDbGllbnQuanMiLCJ3ZWJwYWNrOi8vLy4vU2xpZGVyLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEJ1cmdlck1lbnUge1xuICBjb25zdHJ1Y3RvcihidXJnZXJCdXR0b24sIGFzaWRlUGFuZWwpIHtcbiAgICB0aGlzLmJ1cmdlckJ1dHRvbiA9IGJ1cmdlckJ1dHRvbjtcbiAgICB0aGlzLmFzaWRlUGFuZWwgPSBhc2lkZVBhbmVsO1xuICAgIHRoaXMubmF2SXRlbXMgPSB0aGlzLmFzaWRlUGFuZWwucXVlcnlTZWxlY3RvckFsbChcIi5saW5rXCIpO1xuICAgIHRoaXMubWVkaWFRdWVyeSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogODcwcHgpXCIpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5vbkNsaWNrQnVyZ2VyQnV0dG9uID0gdGhpcy5oYW5kbGVCdXJnZXJCdXR0b24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmJ1cmdlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrQnVyZ2VyQnV0dG9uKTtcblxuICAgIHRoaXMub25DbGlja05hdkxpbmsgPSB0aGlzLmhhbmRsZVBhbmVsQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmFzaWRlUGFuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja05hdkxpbmspO1xuXG4gICAgdGhpcy5vblNjcmVlbkNoYW5nZUhhbmRsZXIgPSB0aGlzLmhhbmRsZVNjcmVlbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMubWVkaWFRdWVyeS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMub25TY3JlZW5DaGFuZ2VIYW5kbGVyKTtcblxuICAgIHRoaXMub25DYW5jZWxIYW5kbGVyID0gdGhpcy5oYW5kbGVDYW5jZWwuYmluZCh0aGlzKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLm9uQ2FuY2VsSGFuZGxlcik7XG4gIH1cblxuICBoYW5kbGVCdXJnZXJCdXR0b24oKSB7XG4gICAgdGhpcy5hc2lkZVBhbmVsLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XG4gICAgdGhpcy5idXJnZXJCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKTtcblxuICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMuYXNpZGVQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IGlzT3BlbiA/IFwiaGlkZGVuXCIgOiBcIlwiO1xuICB9XG5cbiAgaGFuZGxlU2NyZWVuQ2hhbmdlKGV2ZW50KSB7XG4gICAgaWYgKCFldmVudC5tYXRjaGVzKSB7XG4gICAgICB0aGlzLmFzaWRlUGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIHRoaXMuYnVyZ2VyQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJcIjtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVQYW5lbENsaWNrKGV2ZW50KSB7XG4gICAgY29uc3QgY2xpY2tlZExpbmsgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi5saW5rXCIpO1xuICAgIGlmICghY2xpY2tlZExpbmspIHJldHVybjtcbiAgICB0aGlzLmhhbmRsZUJ1cmdlckJ1dHRvbigpO1xuICB9XG5cbiAgaGFuZGxlQ2FuY2VsKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleSAhPT0gXCJFc2NhcGVcIikgcmV0dXJuO1xuICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMuYXNpZGVQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5oYW5kbGVCdXJnZXJCdXR0b24oKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuYnVyZ2VyQnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tCdXJnZXJCdXR0b24pO1xuICAgIHRoaXMuYXNpZGVQYW5lbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrTmF2TGluayk7XG4gICAgdGhpcy5tZWRpYVF1ZXJ5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5vblNjcmVlbkNoYW5nZUhhbmRsZXIpO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcIlwiO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1cmdlck1lbnU7XG4iLCJcclxuY2xhc3MgRGF0YUNsaWVudCB7XHJcbiAgY29uc3RydWN0b3IobmFtZXNwYWNlID0gXCJjb2ZmZWUtaG91c2VcIikge1xyXG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRJdGVtKGtleSA9ICcnKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMubmFtZXNwYWNlfToke2tleX1gKTtcclxuICAgIHJldHVybiB2YWx1ZSA/IEpTT04ucGFyc2UodmFsdWUpIDogbnVsbDtcclxuICB9XHJcblxyXG4gIHNldEl0ZW0oa2V5ID0gJycsIHZhbHVlID0gdW5kZWZpbmVkKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLm5hbWVzcGFjZX06JHtrZXl9YCwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUl0ZW0oa2V5ID0gJycpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGAke3RoaXMubmFtZXNwYWNlfToke2tleX1gKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGFDbGllbnRcclxuIiwiY2xhc3MgU2xpZGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgd3JhcHBlcixcbiAgICBzbGlkZXMsXG4gICAgbGlzdENvbnRhaW5lciA9IHVuZGVmaW5lZCxcbiAgICB0YWJzID0gdW5kZWZpbmVkLFxuICAgIHJpZ2h0VGFiID0gdW5kZWZpbmVkLFxuICAgIGxlZnRUYWIgPSB1bmRlZmluZWQsXG4gICkge1xuICAgIHRoaXMudGFicyA9IHRhYnM7XG4gICAgdGhpcy5zbGlkZXMgPSBzbGlkZXM7XG4gICAgdGhpcy5saXN0Q29udGFpbmVyID0gbGlzdENvbnRhaW5lcjtcbiAgICB0aGlzLndyYXBwZXIgPSB3cmFwcGVyO1xuICAgIHRoaXMucmlnaHRUYWIgPSByaWdodFRhYjtcbiAgICB0aGlzLmxlZnRUYWIgPSBsZWZ0VGFiO1xuICAgIHRoaXMuc2xpZGVXaWR0aCA9IDA7XG4gICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNyZWF0ZUNsb25lcygpO1xuICAgIHRoaXMudXBkYXRlRGltZW5zaW9ucygpO1xuICAgIHRoaXMubGlzdENvbnRhaW5lci5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IFwiYXV0b1wiO1xuICAgIHRoaXMubGlzdENvbnRhaW5lci5zdHlsZS5zY3JvbGxTbmFwVHlwZSA9IFwibm9uZVwiO1xuICAgIHRoaXMubGlzdENvbnRhaW5lci5zY3JvbGxMZWZ0ID0gdGhpcy5zbGlkZVdpZHRoO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMubGlzdENvbnRhaW5lci5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IFwic21vb3RoXCI7XG4gICAgICB0aGlzLmxpc3RDb250YWluZXIuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSBcInggbWFuZGF0b3J5XCI7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB0aGlzLmluaXRPYnNlcnZlcigpO1xuICAgIHRoaXMuaW5pdFJlc2l6ZU9ic2VydmVyKCk7XG4gIH1cblxuICBjcmVhdGVDbG9uZXMoKSB7XG4gICAgY29uc3QgZmlyc3RDbG9uZSA9IHRoaXMuc2xpZGVzWzBdLmNsb25lTm9kZSh0cnVlKTtcbiAgICBjb25zdCBsYXN0Q2xvbmUgPSB0aGlzLnNsaWRlc1t0aGlzLnNsaWRlcy5sZW5ndGggLSAxXS5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICBmaXJzdENsb25lLmRhdGFzZXQuaXNDbG9uZSA9IFwidHJ1ZVwiO1xuICAgIGxhc3RDbG9uZS5kYXRhc2V0LmlzQ2xvbmUgPSBcInRydWVcIjtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5saXN0Q29udGFpbmVyID8gdGhpcy5saXN0Q29udGFpbmVyIDogdGhpcy53cmFwcGVyO1xuICAgIGxpc3QuYXBwZW5kQ2hpbGQoZmlyc3RDbG9uZSk7XG4gICAgbGlzdC5pbnNlcnRCZWZvcmUobGFzdENsb25lLCB0aGlzLnNsaWRlc1swXSk7XG4gIH1cblxuICB1cGRhdGVEaW1lbnNpb25zKCkge1xuICAgIGxldCBvbGRXaWR0aCA9IHRoaXMuc2xpZGVXaWR0aDtcbiAgICB0aGlzLnNsaWRlV2lkdGggPSB0aGlzLndyYXBwZXIub2Zmc2V0V2lkdGg7XG5cbiAgICBpZiAoIW9sZFdpZHRoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGlmZiA9IHRoaXMuc2xpZGVXaWR0aCAtIG9sZFdpZHRoO1xuICAgIHRoaXMubGlzdENvbnRhaW5lci5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IFwiYXV0b1wiO1xuICAgIHRoaXMubGlzdENvbnRhaW5lci5zdHlsZS5zY3JvbGxTbmFwVHlwZSA9IFwibm9uZVwiO1xuXG4gICAgdGhpcy5saXN0Q29udGFpbmVyLnNjcm9sbExlZnQgKz0gZGlmZiAqIHRoaXMuY3VycmVudEluZGV4O1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMubGlzdENvbnRhaW5lci5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IFwic21vb3RoXCI7XG4gICAgICB0aGlzLmxpc3RDb250YWluZXIuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSBcInggbWFuZGF0b3J5XCI7XG4gICAgfSk7XG4gIH1cblxuICBqdW1wVG8ocG9zaXRpb24pIHtcbiAgICB0aGlzLmlzSnVtcGluZyA9IHRydWU7XG5cbiAgICB0aGlzLmxpc3RDb250YWluZXIuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSBcImF1dG9cIjtcbiAgICB0aGlzLmxpc3RDb250YWluZXIuc3R5bGUuc2Nyb2xsU25hcFR5cGUgPSBcIm5vbmVcIjtcblxuICAgIHRoaXMubGlzdENvbnRhaW5lci5zY3JvbGxMZWZ0ID0gcG9zaXRpb247XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5saXN0Q29udGFpbmVyLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gXCJzbW9vdGhcIjtcbiAgICAgIHRoaXMubGlzdENvbnRhaW5lci5zdHlsZS5zY3JvbGxTbmFwVHlwZSA9IFwieCBtYW5kYXRvcnlcIjtcbiAgICAgIHRoaXMuaXNKdW1waW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHRoaXMub25TY3JvbGxIYW5kbGVyID0gdGhpcy5oYW5kbGVTY3JvbGwuYmluZCh0aGlzKTtcbiAgICAvLyB0aGlzLm9uUmVzaXplSGFuZGxlciA9IHRoaXMudXBkYXRlRGltZW5zaW9ucy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5saXN0Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5vblNjcm9sbEhhbmRsZXIpO1xuICAgIC8vd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5vblJlc2l6ZUhhbmRsZXIpO1xuXG4gICAgaWYgKHRoaXMudGFicykge1xuICAgICAgdGhpcy5vblRhYkNsaWNrSGFuZGxlciA9IHRoaXMuaGFuZGxlVGFiQ2xpY2suYmluZCh0aGlzKTtcbiAgICAgIHRoaXMudGFicy5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uVGFiQ2xpY2tIYW5kbGVyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJpZ2h0VGFiKSB7XG4gICAgICB0aGlzLm9uUmlnaHRUYWIgPSB0aGlzLm5leHQuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMucmlnaHRUYWIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25SaWdodFRhYik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGVmdFRhYikge1xuICAgICAgdGhpcy5vbkxlZnRUYWIgPSB0aGlzLnByZXYuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMubGVmdFRhYi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkxlZnRUYWIpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVNjcm9sbCgpIHtcbiAgICBpZiAodGhpcy5pc0p1bXBpbmcpIHJldHVybjtcblxuICAgIGNvbnN0IGN1cnJlbnRTY3JvbGwgPSB0aGlzLmxpc3RDb250YWluZXIuc2Nyb2xsTGVmdDtcbiAgICBjb25zdCBtYXhTY3JvbGwgPSB0aGlzLnNsaWRlV2lkdGggKiAodGhpcy5zbGlkZXMubGVuZ3RoICsgMSk7XG5cbiAgICBpZiAoY3VycmVudFNjcm9sbCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIHRoaXMuanVtcFRvKHRoaXMuc2xpZGVXaWR0aCk7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50U2Nyb2xsIDw9IDApIHtcbiAgICAgIHRoaXMuanVtcFRvKHRoaXMuc2xpZGVXaWR0aCAqIHRoaXMuc2xpZGVzLmxlbmd0aCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlVGFiQ2xpY2soZXZlbnQpIHtcbiAgICBjb25zdCBjbGlja2VkVGFiID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIuY29udHJvbFwiKTtcbiAgICBpZiAoIWNsaWNrZWRUYWIpIHJldHVybjtcblxuICAgIGNvbnN0IHRhcmdldEluZGV4ID0gcGFyc2VJbnQoY2xpY2tlZFRhYi5pZC5yZXBsYWNlKC9bXlxcZF0vZywgXCJcIiksIDEwKTtcbiAgICBpZiAoaXNOYU4odGFyZ2V0SW5kZXgpKSByZXR1cm47XG5cbiAgICB0aGlzLmlzUHJvZ3JhbW1hdGljU2Nyb2xsaW5nID0gdHJ1ZTtcblxuICAgIHRoaXMuc2V0QWN0aXZlVGFiKHRhcmdldEluZGV4KTtcbiAgICBpZiAodGhpcy5saXN0Q29udGFpbmVyKSB7XG4gICAgICB0aGlzLmxpc3RDb250YWluZXIuc2Nyb2xsTGVmdCA9IHRhcmdldEluZGV4ICogdGhpcy5zbGlkZVdpZHRoO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaXNQcm9ncmFtbWF0aWNTY3JvbGxpbmcgPSBmYWxzZTtcbiAgICB9LCA0NTApO1xuICB9XG5cbiAgc2V0QWN0aXZlVGFiKGFjdGl2ZUluZGV4KSB7XG4gICAgdGhpcy50YWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgY29uc3QgdGFiSW5kZXggPSBwYXJzZUludCh0YWIuaWQucmVwbGFjZSgvW15cXGRdL2csIFwiXCIpLCAxMCk7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKFxuICAgICAgICBcImFyaWEtc2VsZWN0ZWRcIixcbiAgICAgICAgdGFiSW5kZXggPT09IGFjdGl2ZUluZGV4ID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIsXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgbmV4dCgpIHtcbiAgICB0aGlzLmxpc3RDb250YWluZXIuc2Nyb2xsTGVmdCArPSB0aGlzLnNsaWRlV2lkdGg7XG4gIH1cblxuICBwcmV2KCkge1xuICAgIHRoaXMubGlzdENvbnRhaW5lci5zY3JvbGxMZWZ0IC09IHRoaXMuc2xpZGVXaWR0aDtcbiAgfVxuXG4gIGluaXRPYnNlcnZlcigpIHtcbiAgICB0aGlzLm9ic2VydmVyT3B0aW9ucyA9IHtcbiAgICAgIHJvb3Q6IHRoaXMubGlzdENvbnRhaW5lcixcbiAgICAgIHRocmVzaG9sZDogMC42LFxuICAgIH07XG5cbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbnRyaWVzKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1Byb2dyYW1tYXRpY1Njcm9sbGluZyB8fCB0aGlzLmlzSnVtcGluZykgcmV0dXJuO1xuXG4gICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZyAmJiAhZW50cnkudGFyZ2V0LmRhdGFzZXQuaXNDbG9uZSkge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoZW50cnkudGFyZ2V0LmlkLnJlcGxhY2UoL1teXFxkXS9nLCBcIlwiKSwgMTApO1xuXG4gICAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZVRhYihpbmRleCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LCB0aGlzLm9ic2VydmVyT3B0aW9ucyk7XG5cbiAgICB0aGlzLmxpc3RDb250YWluZXJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLml0ZW0tc2xpZGVyXCIpXG4gICAgICAuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5vYnNlcnZlci5vYnNlcnZlKGl0ZW0pKTtcbiAgfVxuXG4gIGluaXRSZXNpemVPYnNlcnZlcigpIHtcbiAgICB0aGlzLnJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlRGltZW5zaW9ucygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMud3JhcHBlcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxuY29uc3QgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRjb25zdCBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0Y29uc3QgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdGNvbnN0IGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpOyIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgQnVyZ2VyTWVudSBmcm9tIFwiLi9CdXJnZXJNZW51XCI7XG5pbXBvcnQgRGF0YUNsaWVudCBmcm9tIFwiLi9EYXRhQ2xpZW50XCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCIuL1NsaWRlclwiO1xuXG5jb25zdCBsaWdodEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlnaHRcIik7XG5jb25zdCBkYXJrQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXJrXCIpO1xuXG5jb25zdCBkYXRhQ2xpZW50ID0gbmV3IERhdGFDbGllbnQoKTtcblxuY29uc3Qgc2xpZGVyU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZC1zbGlkZXJcIik7XG5jb25zdCBzbGlkZXJXcmFwcGVyID0gc2xpZGVyU2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLnJvdy1zbGlkZXJcIik7XG5jb25zdCBzbGlkZXMgPSBzbGlkZXJTZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaXRlbS1zbGlkZXJcIik7XG5jb25zdCBzbGlkZXJsaXN0ID0gc2xpZGVyU2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlci1saXN0XCIpO1xuY29uc3Qgc2xpZGVyVGFicyA9IHNsaWRlclNlY3Rpb24ucXVlcnlTZWxlY3RvckFsbChcIi5jb250cm9sXCIpO1xuY29uc3Qgc2xpZGVyUmlnaHRUYWIgPSBzbGlkZXJTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIuYnV0dG9uLWljb24tcmlnaHRcIik7XG5jb25zdCBzbGlkZXJMZWZ0VGFiID0gc2xpZGVyU2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLmJ1dHRvbi1pY29uLWxlZnRcIik7XG5cbmNvbnN0IGJ1cmdlckJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnV0dG9uLWljb24tYnVyZ2VyXCIpO1xuY29uc3QgYnVyZ2VyQWNpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ1cmdlci1uYXZcIik7XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgY29uc3QgZGF0YVRoZW1lID0gYXdhaXQgZGF0YUNsaWVudC5nZXRJdGVtKFwidGhlbWVcIik7XG4gIGlmIChkYXRhVGhlbWUpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcImRhcmtcIik7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIik7XG4gIH1cblxuICBkYXJrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcImRhcmtcIik7XG4gICAgZGF0YUNsaWVudC5zZXRJdGVtKFwidGhlbWVcIiwgdHJ1ZSk7XG4gIH0pO1xuXG4gIGxpZ2h0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS10aGVtZVwiKTtcbiAgICBkYXRhQ2xpZW50LnNldEl0ZW0oXCJ0aGVtZVwiLCBmYWxzZSk7XG4gIH0pO1xufVxuXG5jb25zdCBzbGlkZXIgPSBuZXcgU2xpZGVyKFxuICBzbGlkZXJXcmFwcGVyLFxuICBzbGlkZXMsXG4gIHNsaWRlcmxpc3QsXG4gIHNsaWRlclRhYnMsXG4gIHNsaWRlclJpZ2h0VGFiLFxuICBzbGlkZXJMZWZ0VGFiLFxuKTtcblxuY29uc3QgYnVyZ2VyTWVudSA9IG5ldyBCdXJnZXJNZW51KGJ1cmdlckJ1dHRvbiwgYnVyZ2VyQWNpZGUpO1xuXG5yZW5kZXIoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==