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

export default MenuItem;
