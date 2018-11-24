(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        const target = entry.target;
        observer.unobserve(target);
        const tagName = target.tagName;
        if (tagName === 'IMG') {
          target.src = target.dataset.src;
        } else if (tagName === 'SOURCE') {
          target.srcset = target.dataset.srcset;
        }
      }
    });
  });
  const entries = document.querySelectorAll('img[lazyload], source[lazyload]');
  for (const entry of entries) {
    observer.observe(entry);
  }
})();
