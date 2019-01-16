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
  let result = [{
    '@type': 'ImageObject',
    'caption': value.content.alttext,
    'url': value.content.href,
    'width': value.content.width,
    'height': value.content.height,
  }];
  return result;
};

const bbc = {
  endpoint: 'https://trevor-producer-cdn.api.bbci.co.uk/content/cps/news/front_page',

  publisher: {
    '@type': 'Organization',
    'logo': {
      '@type': 'ImageObject',
      'width': 200,
      'height': 57,
      'url': `https://news-pwa.glitch.me/img/bbc.png`,
    },
    'icon': {
      'src': '/icons/bbc_492x492.png',
      'sizes': '492x492',
      'type': 'image/png',
    },
    'name': 'BBC News',
    'slug': 'bbc',
  },

  locale: 'en-GB',

  article: {
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
      path: '$.news[*].content[?(@.type=="image_gallery")]',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          const value = item.value.gallery.map((imgObj) => {
            return extractImages(imgObj);
          });
          result[item.path[2]] = result[item.path[2]] ?
              result[item.path[2]].concat(value) : value;
        });
        return result;
      },
    },

    'backstory': {
      'path': '$.news[*].content[?(@.type=="box")]',
      'postprocess': (content) => {
        const result = [];
        content.forEach((item) => {
          const box = item.value.box;
          const value = [{
            '@type': 'CreativeWork',
            'headline': box.title,
            'alternativeHeadline': box.subtitle,
            'images': item.images ? extractImages(box.images) : [],
            'description': box.text,
            'url': '',
            'citation': box.source ? box.source : '',
          }];
          result[item.path[2]] = result[item.path[2]] ?
              result[item.path[2]].concat(value) : value;
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
      path: '$.news[*].geotags',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = item.value.map((tag) => tag.tag).join(', ');
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
          result[item.path[2]] = item.value;
        });
        return result;
      },
    },

    'dateModified': {
      path: '$.relations[*].content.lastUpdated',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = item.value;
        });
        return result;
      },
    },
/*
    'mainEntityOfPage': {
      path: '$.news[*].shareURL',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = item.value;
        });
        return result;
      },
    },

    'author': {
      // eslint-disable-next-line max-len
      path: '$.news[*].content[*][?(@.title=="Korrespondentin" || @.title=="Korrespondent")].text',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = {
            '@type': 'Person',
            'name': item.value.split(',')[0],
          };
        });
        return result;
      },
    },
*/
    'image': {
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
      path: '$.news[*].content[*].video',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          const value = item.value;
          result[item.path[2]] = extractVideos(value);
        });
        return result;
      },
    },

    'audio': {
      path: '$.news[*].content[*].audio',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          const value = item.value;
          result[item.path[2]] = extractAudios(value);
        });
        return result;
      },
    },

    'thumbnailUrl': {
      path: '$.news[*].images[*].videowebs.imageurl',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = item.value;
        });
        return result;
      },
    },

    'mentions': {
      path: '$.news[*].content[?(@.type=="list")]',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          const value = item.value.list.items.map((item) => {
            return {
              // NewsArticle/Article require more details that aren't available
              '@type': 'CreativeWork',
              'headline': item.url.replace(/.*?>(.+?)<\/a>.*?/, '$1'),
              'url': '',
            };
          });
          result[item.path[2]] = value;
        });
        return result;
      },
    },
*/
  },
};

module.exports = bbc;
