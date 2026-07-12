(() => {
  "use strict";

  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-primary-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "×" : "☰";
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      }
    });
  }

  const dragSelectors = [
    ".section-nav",
    ".mini-forecast-grid",
    ".forecast-grid",
    ".metrics-grid",
    ".metric-strip-card",
    "#summary-alert-banner",
    ".alert-map-explainer",
  ];

  for (const scroller of document.querySelectorAll(dragSelectors.join(","))) {
    let down = false;
    let startX = 0;
    let startScroll = 0;
    scroller.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      down = true;
      startX = event.clientX;
      startScroll = scroller.scrollLeft;
      scroller.setPointerCapture?.(event.pointerId);
      scroller.classList.add("is-dragging");
    });
    scroller.addEventListener("pointermove", (event) => {
      if (!down) return;
      scroller.scrollLeft = startScroll - (event.clientX - startX);
    });
    scroller.addEventListener("pointerup", () => {
      down = false;
      scroller.classList.remove("is-dragging");
    });
    scroller.addEventListener("pointercancel", () => {
      down = false;
      scroller.classList.remove("is-dragging");
    });
  }
})();
