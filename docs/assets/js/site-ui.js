
(() => {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const drawer = document.querySelector('[data-mobile-drawer]');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        drawer.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const enableDragScroll = (el) => {
    let down = false;
    let startX = 0;
    let scrollLeft = 0;
    el.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      down = true;
      startX = event.clientX;
      scrollLeft = el.scrollLeft;
      el.classList.add('dragging');
      el.setPointerCapture?.(event.pointerId);
    });
    el.addEventListener('pointermove', (event) => {
      if (!down) return;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 4) event.preventDefault();
      el.scrollLeft = scrollLeft - dx;
    });
    const end = (event) => {
      down = false;
      el.classList.remove('dragging');
      try { el.releasePointerCapture?.(event.pointerId); } catch (_) {}
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('mouseleave', () => {
      down = false;
      el.classList.remove('dragging');
    });
  };

  const bootDrag = () => {
    document.querySelectorAll('.mini-forecast-grid, .forecast-grid, .metrics-grid, .alert-map-explainer').forEach(enableDragScroll);
  };
  bootDrag();
  const observer = new MutationObserver(() => bootDrag());
  observer.observe(document.body, { childList: true, subtree: true });
})();
