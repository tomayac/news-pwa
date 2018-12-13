(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        const targets = entry.target.querySelectorAll('img, source');
        observer.unobserve(entry.target);
        for (const target of targets) {
          const tagName = target.tagName;
          if (tagName === 'IMG') {
            target.src = target.dataset.src;
          } else if (tagName === 'SOURCE') {
            target.srcset = target.dataset.srcset;
          }
        }
      }
    });
  }, {rootMargin: '200px'});
  const entries = document.querySelectorAll('[lazyload]');
  for (const entry of entries) {
    observer.observe(entry);
  }
})();
