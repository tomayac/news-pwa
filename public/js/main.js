import{lazyLoad}from"./lazyload.js";(()=>{const a=document.querySelector("main");a.addEventListener("click",a=>{const b=a.target;if(!b.classList.contains("associate-media")){if(-1!==["H1","H2","PICTURE","IMG","FIGCAPTION"].indexOf(b.nodeName)){const a=b.closest("article").querySelector("details");a.open=!a.open}}}),document.documentElement.style.setProperty("--main-current-width",`${a.offsetWidth}px`);// Debounced `onresize`
let b;window.addEventListener("resize",()=>{clearTimeout(b),b=setTimeout(function(){document.documentElement.style.setProperty("--main-current-width",`${a.offsetWidth}px`)},250)}),lazyLoad()})();