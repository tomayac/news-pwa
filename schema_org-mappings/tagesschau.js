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

  article: {

    '@id': {
      path: '$.news[*].shareURL',
      postprocess: (content) => content.map((item) => item.value),
    },

    'headline': {
      path: '$.news[*].title',
      postprocess: (content) => content.map((item) => item.value),
    },

    'alternativeHeadline': {
      path: '$.news[*].topline',
      postprocess: (content) => content.map((item) => item.value),
    },

    'description': {
      path: '$.news[*].content[0].value',
      postprocess: (content) => content.map((item) => {
        return item.value
            .replace(/<strong>/g, '')
            .replace(/<\/strong>/g, '');
      }),
    },

    'articleBody': {
      path: '$.news[*].content[*]',
      postprocess: (content) => {
        const result = [];
        let buffer = [];
        let i = 0;
        content.forEach((item) => {
          if (item.path[2] !== i) {
            result.push(buffer.join(''));
            buffer = [];
            i++;
          }
          if (item.value.type === 'text') {
            buffer.push(`<p>${item.value.value}</p>`);
          } else {
            buffer.push(item.value.value);
          }
        });
        return result;
      },
    },

    'articleSection': {
      path: '$.news[*].ressort',
      postprocess: (content) => content.map((item) => item.value),
    },

    'dateline': {
      path: '$.news[*].geotags',
      postprocess: (content) => content.map((item) => {
        return item.value.map((tag) => tag.tag).join(', ');
      }),
    },

    'datePublished': {
      path: '$.news[*].date',
      postprocess: (content) => content.map((item) => item.value),
    },

    'mainEntityOfPage': {
      path: '$.news[*].shareURL',
      postprocess: (content) => content.map((item) => item.value),
    },

    'author': {
      // eslint-disable-next-line max-len
      path: '$.news[*].content[*][?(@.title=="Korrespondentin" || @.title=="Korrespondent")].text',
      postprocess: (content) => {
        let max = 0;
        content.forEach((item) => {
          if (item.path[2] > max) {
            max = item.path[2];
          }
        });
        const result = new Array(max);
        content.forEach((item) => {
          result[item.path[2]] = {
            '@type': 'Person',
            'name': item.value.replace(/,\s*$/g, ''),
          };
        });
        return result;
      },
    },

    'image': {
      path: '$.news[*].teaserImage',
      postprocess: (content) => {
        return content.map((item) => {
          item = item.value;
          return [{
            '@type': 'ImageObject',
            'caption': item.alttext,
            'url': item.videowebl.imageurl,
            'width': 960,
            'height': 540,
          }, {
            '@type': 'ImageObject',
            'caption': item.alttext,
            'url': item.videowebm.imageurl,
            'width': 512,
            'height': 288,
          }, {
            '@type': 'ImageObject',
            'caption': item.alttext,
            'url': item.videowebs.imageurl,
            'width': 256,
            'height': 144,
          }, {
            '@type': 'ImageObject',
            'caption': item.alttext,
            'url': item.portraetgrossplus8x9.imageurl,
            'width': 512,
            'height': 576,
          }, {
            '@type': 'ImageObject',
            'caption': item.alttext,
            'url': item.portraetgross8x9.imageurl,
            'width': 256,
            'height': 288,
          }];
        });
      },
    },

    'thumbnailUrl': {
      path: '$.news[*].images[*].videowebs.imageurl',
      postprocess: (content) => content.map((item) => item.value),
    },

  },
};
