"use strict";

(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio > 0) {
        var targets = entry.target.querySelectorAll('img, source, video, audio');
        observer.unobserve(entry.target);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var target = _step.value;
            var tagName = target.tagName;

            if (tagName === 'IMG') {
              target.src = target.dataset.src;
            } else if (tagName === 'SOURCE' && target.parentNode.nodeName === 'PICTURE') {
              target.srcset = target.dataset.srcset;
            } else if (tagName === 'VIDEO') {
              target.poster = target.dataset.poster;
              target.preload = 'metadata';
            } else if (tagName === 'AUDIO') {
              target.preload = 'metadata';
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    });
  }, {
    rootMargin: '200px'
  });
  var entries = document.querySelectorAll('[lazyload]');
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = entries[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var entry = _step2.value;
      observer.observe(entry);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
})();
"use strict";

(function () {
  var main = document.querySelector('main');
  main.addEventListener('click', function (event) {
    var target = event.target;

    if (target.classList.contains('associate-media')) {
      return;
    }

    var expandTargets = ['H1', 'H2', 'PICTURE', 'IMG', 'FIGCAPTION'];

    if (expandTargets.indexOf(target.nodeName) !== -1) {
      var details = target.closest('article').querySelector('details');
      details.open = !details.open;
    }
  }); // Needed for calculating image dimensions

  document.documentElement.style.setProperty('--main-current-width', "".concat(main.offsetWidth, "px")); // Debounced `onresize`

  var resizeTimer;
  window.addEventListener('resize', function (e) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      document.documentElement.style.setProperty('--main-current-width', "".concat(main.offsetWidth, "px"));
    }, 250);
  });
})();
