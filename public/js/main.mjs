(() => {
  document.querySelector('main').addEventListener('click', (event) => {
    const target = event.target;
    const expandTargets = ['H1', 'H2', 'PICTURE', 'IMG', 'FIGCAPTION'];
    if (expandTargets.indexOf(target.nodeName) !== -1) {
      const details = target.closest('article').querySelector('details');
      details.open = !details.open;
    }
  });
})();
