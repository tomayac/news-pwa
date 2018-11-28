const fixTypography = (value) => {
  return value
      // Curly quotes
      .replace(/"(.*?)"/gm, '“$1”')
      // Proper em-dashes with breaking thin space
      .replace(/\s-\s/gm, ' — ');
};

module.exports = {
  endpoint: 'https://www.tagesschau.de/api2/',

  publisher: {
    '@type': 'Organization',
    'logo': {
      '@type': 'ImageObject',
      'height': 70,
      'width': 306,
      // eslint-disable-next-line max-len
      'url': 'https://www.tagesschau.de/resources/framework/img/tagesschau/banner/logo_base.png',
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
          let value = item.value.type === 'text' ?
              `<p>${item.value.value}</p>` : item.value.value;
          // Remove `<strong>`
          value = value.replace(/<\/?strong>/g, '');
          result[item.path[2]] = fixTypography(value);
        });
        return result;
      },
    },

    'articleBody': {
      path: '$.news[*].content[?(@.type=="text" || @.type=="headline")]',
      postprocess: (content) => {
        const result = [];
        content.forEach((item) => {
          let value = item.value.type === 'text' ?
              `<p>${item.value.value}</p>` : item.value.value;
          // Remove `<strong>`
          value = value.replace(/<\/?strong>/g, '');
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
          result[item.path[2]] = [{
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
          }, {
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
          }];
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

  },
};
