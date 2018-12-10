(() => {
  const main = document.querySelector('main');

  main.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('associate-media')) {
      return;
    }
    const expandTargets = ['H1', 'H2', 'PICTURE', 'IMG', 'FIGCAPTION'];
    if (expandTargets.indexOf(target.nodeName) !== -1) {
      const details = target.closest('article').querySelector('details');
      details.open = !details.open;
    }
  });

  // Needed for calculating image dimensions
  document.documentElement.style.setProperty('--main-current-width',
      `${main.offsetWidth}px`);

  // Debounced `onresize`
  let resizeTimer;
  window.addEventListener('resize', (e) => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      document.documentElement.style.setProperty('--main-current-width',
          `${main.offsetWidth}px`);
    }, 250);
  });
})();
