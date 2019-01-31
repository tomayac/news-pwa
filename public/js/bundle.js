"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.lazyLoad=void 0;var lazyLoad=function(){var a=new IntersectionObserver(function(b){b.forEach(function(b){if(0<b.intersectionRatio){var j=b.target.querySelectorAll("img, source, video, audio");a.unobserve(b.target);var c=!0,d=!1,e=void 0;try{for(var f,g=j[Symbol.iterator]();!(c=(f=g.next()).done);c=!0){var h=f.value,i=h.tagName;"IMG"===i?h.src=h.dataset.src:"SOURCE"===i&&"PICTURE"===h.parentNode.nodeName?h.srcset=h.dataset.srcset:"VIDEO"===i?(h.poster=h.dataset.poster,h.preload="metadata"):"AUDIO"===i&&(h.preload="metadata")}}catch(a){d=!0,e=a}finally{try{c||null==g.return||g.return()}finally{if(d)throw e}}}})},{rootMargin:"200px"}),b=document.querySelectorAll("[lazyload]"),c=!0,d=!1,e=void 0;try{for(var f,g,h=b[Symbol.iterator]();!(c=(f=h.next()).done);c=!0)g=f.value,a.observe(g)}catch(a){d=!0,e=a}finally{try{c||null==h.return||h.return()}finally{if(d)throw e}}};exports.lazyLoad=lazyLoad;
"use strict";var _lazyload=require("./lazyload.mjs");(function(){var a=document.querySelector("main");a.addEventListener("click",function(a){var b=a.target;if(!b.classList.contains("associate-media")){if(-1!==["H1","H2","PICTURE","IMG","FIGCAPTION"].indexOf(b.nodeName)){var c=b.closest("article").querySelector("details");c.open=!c.open}}}),document.documentElement.style.setProperty("--main-current-width","".concat(a.offsetWidth,"px"));// Debounced `onresize`
var b;window.addEventListener("resize",function(){clearTimeout(b),b=setTimeout(function(){document.documentElement.style.setProperty("--main-current-width","".concat(a.offsetWidth,"px"))},250)}),(0,_lazyload.lazyLoad)()})();
