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

export default Slider;
