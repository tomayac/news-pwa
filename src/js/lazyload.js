export const lazyLoad = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        const targets = entry.target.querySelectorAll(
            'img, source, video, audio');
        observer.unobserve(entry.target);
        for (const target of targets) {
          const tagName = target.tagName;
          if (tagName === 'IMG') {
            target.src = target.dataset.src;
          } else if ((tagName === 'SOURCE') &&
                     (target.parentNode.nodeName === 'PICTURE')) {
            target.srcset = target.dataset.srcset;
          } else if (tagName === 'VIDEO') {
            target.poster = target.dataset.poster;
            target.preload = 'metadata';
          } else if (tagName === 'AUDIO') {
            target.preload = 'metadata';
          }
        }
      }
    });
  }, {rootMargin: '200px'});
  const entries = document.querySelectorAll('[lazyload]');
  for (const entry of entries) {
    observer.observe(entry);
  }
};
