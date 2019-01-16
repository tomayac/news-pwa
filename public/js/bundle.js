'use strict'; (function() {
  var a=new IntersectionObserver(function(b) {
    b.forEach(function(b) {
      if (0<b.intersectionRatio) {
        const j=b.target.querySelectorAll('img, source, video, audio'); a.unobserve(b.target); let c=!0; let d=!1; let e=void 0; try {
          for (var f, g=j[Symbol.iterator](); !(c=(f=g.next()).done); c=!0) {
            const h=f.value; const i=h.tagName; 'IMG'===i?h.src=h.dataset.src:'SOURCE'===i&&'PICTURE'===h.parentNode.nodeName?h.srcset=h.dataset.srcset:'VIDEO'===i?(h.poster=h.dataset.poster, h.preload='metadata'):'AUDIO'===i&&(h.preload='metadata');
          }
        } catch (a) {
          d=!0, e=a;
        } finally {
          try {
            c||null==g.return||g.return();
          } finally {
            if (d) throw e;
          }
        }
      }
    });
  }, {rootMargin: '200px'}); const b=document.querySelectorAll('[lazyload]'); let c=!0; let d=!1; let e=void 0; try {
    for (var f, g, h=b[Symbol.iterator](); !(c=(f=h.next()).done); c=!0)g=f.value, a.observe(g);
  } catch (a) {
    d=!0, e=a;
  } finally {
    try {
      c||null==h.return||h.return();
    } finally {
      if (d) throw e;
    }
  }
})();
'use strict'; (function() {
  const a=document.querySelector('main'); a.addEventListener('click', function(a) {
    const b=a.target; if (!b.classList.contains('associate-media')) {
      if (-1!==['H1', 'H2', 'PICTURE', 'IMG', 'FIGCAPTION'].indexOf(b.nodeName)) {
        const c=b.closest('article').querySelector('details'); c.open=!c.open;
      }
    }
  }), document.documentElement.style.setProperty('--main-current-width', ''.concat(a.offsetWidth, 'px'));// Debounced `onresize`
  let b; window.addEventListener('resize', function() {
    clearTimeout(b), b=setTimeout(function() {
      document.documentElement.style.setProperty('--main-current-width', ''.concat(a.offsetWidth, 'px'));
    }, 250);
  });
})();
