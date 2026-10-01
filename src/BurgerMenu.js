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

export default BurgerMenu;
