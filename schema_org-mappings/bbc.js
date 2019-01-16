const jsdom = require('jsdom');

const fixTypography = (value) => {
  const dom = new jsdom.JSDOM(value);
  const win = dom.window;
  const doc = win.document;
  const treeWalker = doc.createTreeWalker(doc.body, win.NodeFilter.SHOW_TEXT,
      null, false);
  let next;
  while (next = treeWalker.nextNode()) {
    next.textContent = next.textContent
    // Curly quotes
        .replace(/"(.*?)"/gm, '“$1”')
    // Proper em-dashes with breaking thin space
        .replace(/\s-\s/gm, ' — ');
  }
  return doc.body.innerHTML;
};

const extractImages = (value) => {
  const result = [{
    '@type': 'ImageObject',
    'caption': value.content.alttext,
    'url': value.content.href,
    'width': value.content.width,
    'height': value.content.height,
  }];
  return result;
};

const bbc = {
  // eslint-disable-next-line max-len
  'endpoint': 'https://trevor-producer-cdn.api.bbci.co.uk/content/cps/news/front_page',

  'icon': {
    'src': '/icons/bbc_492x492.png',
    'sizes': '492x492',
    'type': 'image/png',
  },

  'slug': 'bbc',

  'publisher': {
    '@type': 'Organization',
    'logo': {
      '@type': 'ImageObject',
      'width': 200,
      'height': 57,
      'url': `https://news-pwa.glitch.me/img/bbc.png`,
    },
    'name': 'BBC News',
  },

  'locale': 'en-GB',

  'article': {
    '@id': {
      path: '$.relations[*].content.id',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = item.value;
        });
        return result;
      },
    },

    'headline': {
      path: '$.relations[*].content.name',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = fixTypography(item.value);
        });
        return result;
      },
    },

    'alternativeHeadline': {
      path: '$.relations[*].content.shortName',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = fixTypography(item.value);
        });
        return result;
      },
    },

    'description': {
      path: '$.relations[*].content.summary',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = fixTypography(item.value);
        });
        return result;
      },
    },

    'articleBody': {
      path: '$.relations[*].content.summary',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = fixTypography(item.value);
        });
        return result;
      },
    },

    /*
    'associatedMedia': {
      path: '',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
        });
        return result;
      },
    },

    'backstory': {
      'path': '',
      'postprocess': (content) => {
        const result = [];
        content.forEach((item) => {
        });
        return result;
      },
    },
    */

    'articleSection': {
      path: '$.relations[*].content.passport.category.categoryName',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = item.value;
        });
        return result;
      },
    },

    /*
    'dateline': {
      path: '',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
        });
        return result;
      },
    },
    */

    'datePublished': {
      path: '$.relations[*].content.lastUpdated',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = new Date(item.value);
        });
        return result;
      },
    },

    'dateModified': {
      path: '$.relations[*].content.lastUpdated',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = new Date(item.value);
        });
        return result;
      },
    },

    /*
    'mainEntityOfPage': {
      path: '',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
        });
        return result;
      },
    },

    'author': {
      path: '',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
        });
        return result;
      },
    },
    */

    'image': {
      // eslint-disable-next-line max-len
      path: '$.relations[*].content.relations[?(@.primaryType=="bbc.mobile.news.image")]',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          const value = item.value;
          result[item.path[2]] = extractImages(value);
        });
        return result;
      },
    },

    /*
    'video': {
      path: '',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
        });
        return result;
      },
    },

    'audio': {
      path: '',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
        });
        return result;
      },
    },

    'thumbnailUrl': {
      path: '',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
        });
        return result;
      },
    },

    'mentions': {
      path: '',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
        });
        return result;
      },
    },
    */

  },
};

module.exports = bbc;
