const fixTypography = (value) => {
  return value
      // Curly quotes
      .replace(/"(.*?)"/gm, '“$1”')
      // Proper em-dashes with breaking thin space
      .replace(/\s-\s/gm, ' — ');
};

const extractImages = (value) => {
  let result = [{
    '@type': 'ImageObject',
    'caption': value.alttext,
    'url': value.videowebl.imageurl,
    'width': 960,
    'height': 540,
  }, {
    '@type': 'ImageObject',
    'caption': value.alttext,
    'url': value.videowebm.imageurl,
    'width': 512,
    'height': 288,
  }, {
    '@type': 'ImageObject',
    'caption': value.alttext,
    'url': value.videowebs.imageurl,
    'width': 256,
    'height': 144,
  }];
  if (value.portraetgrossplus8x9 && value.portraetgross8x9) {
    result = result.concat([{
      '@type': 'ImageObject',
      'caption': value.alttext,
      'url': value.portraetgrossplus8x9.imageurl,
      'width': 512,
      'height': 576,
    }, {
      '@type': 'ImageObject',
      'caption': value.alttext,
      'url': value.portraetgross8x9.imageurl,
      'width': 256,
      'height': 288,
    }]);
  }
  return result;
};

const extractVideos = (value) => {
  return [{
    '@type': 'VideoObject',
    'caption': value.title,
    'contentUrl': value.streams.h264xl,
    'description': value.teaserImage.title,
    'name': value.alttext,
    'thumbnailUrl': value.teaserImage.videowebl.imageurl,
    'uploadDate': value.date,
    'width': 1280,
    'height': 720,
  }, {
    '@type': 'VideoObject',
    'caption': value.title,
    'contentUrl': value.streams.h264m,
    'description': value.teaserImage.title,
    'name': value.alttext,
    'thumbnailUrl': value.teaserImage.videowebm.imageurl,
    'uploadDate': value.date,
    'width': 512,
    'height': 288,
  }, {
    '@type': 'VideoObject',
    'caption': value.title,
    'contentUrl': value.streams.h264s,
    'description': value.teaserImage.title,
    'name': value.alttext,
    'thumbnailUrl': value.teaserImage.videowebs.imageurl,
    'uploadDate': value.date,
    'width': 256,
    'height': 144,
  }];
};

const extractAudios = (value) => {
  if (value.teaserImage) {
    return [{
      '@type': 'AudioObject',
      'contentUrl': value.stream,
      'description': value.text,
      'name': value.title,
      'thumbnailUrl': value.teaserImage.videowebl.imageurl,
      'uploadDate': value.date,
      'width': 1280,
      'height': 720,
    }, {
      '@type': 'AudioObject',
      'contentUrl': value.stream,
      'description': value.text,
      'name': value.title,
      'thumbnailUrl': value.teaserImage.videowebm.imageurl,
      'uploadDate': value.date,
      'width': 512,
      'height':288,
    }, {
      '@type': 'AudioObject',
      'contentUrl': value.stream,
      'description': value.text,
      'name': value.title,
      'thumbnailUrl': value.teaserImage.videowebs.imageurl,
      'uploadDate': value.date,
      'width': 256,
      'height': 144,
    }];
  } else {
    return [{
      '@type': 'AudioObject',
      'contentUrl': value.stream,
      'description': value.text,
      'name': value.title,
      'uploadDate': value.date,
    }];
  }
};

const tagesschau = {
  endpoint: 'https://www.tagesschau.de/api2/',

  publisher: {
    '@type': 'Organization',
    'logo': {
      '@type': 'ImageObject',
      'width': 262,
      'height': 60,
      'url': 'https://news-pwa.glitch.me/img/tagesschau.png',
    },
    'name': 'tagesschau.de',
  },

  locale: 'de-DE',

  article: {
    '@id': {
      path: '$.news[*].shareURL',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = item.value;
        });
        return result;
      },
    },

    'headline': {
      path: '$.news[*].title',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = fixTypography(item.value);
        });
        return result;
      },
    },

    'alternativeHeadline': {
      path: '$.news[*].topline',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = fixTypography(item.value);
        });
        return result;
      },
    },

    'description': {
      path: '$.news[*].content[0]',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          if ((!item.value.value) ||
              (item.value.type !== 'text' && item.value.type !== 'headline')) {
            return;
          }
          let value = `<p>${item.value.value}</p>`;
          // Remove `<h2>`
          value = value.replace(/<\/?h2>/g, '');
          result[item.path[2]] = fixTypography(value);
        });
        return result;
      },
    },

    'articleBody': {
      // eslint-disable-next-line max-len
      path: '$.news[*].content[?(@.type=="text" || @.type=="headline" || @.type=="quotation")]',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          let value;
          if (item.value.type === 'text') {
            value = `<p>${item.value.value}</p>`;
          } else if (item.value.type === 'headline') {
            value = item.value.value;
          } else if (item.value.type === 'quotation') {
            value = `<blockquote>${item.value.quotation.text}</blockquote>`;
          }
          // Rewrite `<h2>` to `<h3>`
          value = value.replace(/<(\/?)h2>/g, '<$1h3>');
          // Fix typography
          value = fixTypography(value);
          result[item.path[2]] = result[item.path[2]] ?
              result[item.path[2]] += value : value;
        });
        return result;
      },
    },

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
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          const box = item.value.box;
          const value = [{
            '@type': 'CreativeWork',
            headline: box.title,
            alternativeHeadline: box.subtitle,
            images: item.images ? extractImages(box.images) : [],
            description: box.text,
            url: box.link ? box.link.replace(/.*href="([^"]+)".*/, '$1') : '',
            citation: box.source ? box.source : '',
          }];
          result[item.path[2]] = result[item.path[2]] ?
              result[item.path[2]].concat(value) : value;
        });
        return result;
      },
    },

    'articleSection': {
      path: '$.news[*].ressort',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] =
              `${item.value[0].toUpperCase()}${item.value.slice(1)}`;
        });
        return result;
      },
    },

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

    'datePublished': {
      path: '$.news[*].date',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = item.value;
        });
        return result;
      },
    },

    'dateModified': {
      path: '$.news[*].date',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          result[item.path[2]] = item.value;
        });
        return result;
      },
    },

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

    'image': {
      path: '$.news[*].teaserImage',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          const value = item.value;
          result[item.path[2]] = extractImages(value);
        });
        return result;
      },
    },

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
          const value = item.value.list.items.map(item => {
            return {
              // NewsArticle/Article require more details that aren't available
              '@type': 'CreativeWork',
              'headline': item.url.replace(/.*?>(.+?)<\/a>.*?/, '$1'),
              'url': item.url.replace(/.*href="([^"]+)".*/, '$1')
            };
          });
          result[item.path[2]] = value;
        });
        return result;
      },
    },

  },
};

module.exports = tagesschau;
