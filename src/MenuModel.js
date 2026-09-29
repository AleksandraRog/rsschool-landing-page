import DataClient from "./DataClient";
import MenuItem from "./MenuItem";

import { START_CATEGORY } from "./config";

class MenuModel {
  constructor() {
    this._products = [];
    this._category = "";
    this._currentPage = 0;
    this._pageSize = undefined;
    this._currentCart = undefined;
    this._theme = false;
    this.dataClient = new DataClient();

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

    const productsModule = await import("./images/products.json", {
      with: { type: "json" },
    });
    this._products = productsModule.default.map((item) => new MenuItem(item));

    this._category = START_CATEGORY;

    this.setTheme(dataTheme);
    this.getFilterProduct(START_CATEGORY);
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

export default MenuModel;
