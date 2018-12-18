const request = require('request-promise-native');
const jsonPath = require('jsonpath');
const crypto = require('crypto');
const readingTime = require('reading-time');

const NEWS_PROVIDERS = {
  tagesschau: require('../schema_org-mappings/tagesschau'),
};

const news = {
  cachedNews: {},

  getFrontPageNews: async (url) => {
    try {
      const options = {
        url: url,
        json: true,
        headers: {
          'User-Agent': 'News PWA Demo (https://github.com/tomayac/news-pwa)',
        },
      };
      let data = await request.get(options);
      if (typeof data !== 'object') {
        data = data.replace(/<!--.*?-->/g, '');
        data = JSON.parse(data);
      }
      return data;
    } catch (e) {
      return new Error('Invalid news provider.');
    }
  },

  parseNewsJson: (newsProvider, raw) => {
    let parsed = [];
    Object.keys(newsProvider.article).forEach((key) => {
      let temp = jsonPath.nodes(raw, newsProvider.article[key].path);
      temp = newsProvider.article[key].postprocess(temp);
      // `temp` can be holey, so use a `for` loop that doesn't skip holes
      for (let i = 0, lenI = temp.length; i < lenI; i++) {
        const item = temp[i];
        parsed[i] = parsed[i] || {
          '@context': 'http://schema.org',
          '@type': 'NewsArticle',
          'publisher': newsProvider.publisher,
        };
        parsed[i][key] = item;
      }
    });
    parsed = parsed.filter((item) => {
      // Only consider articles with an `articleBody`
      return item.articleBody;
    }).map((item) => {
      // Add rough article stats
      const articleStats = readingTime(item.articleBody);
      item.timeRequired = `PT${Math.ceil(articleStats.minutes)}M`;
      item.wordCount = articleStats.words;
      if (item.author === undefined) {
        // If there is no named `author`, the `author` is the `publisher`
        item.author = newsProvider.publisher;
      }
      return item;
    });
    return parsed;
  },

  updateCachedNews: async () => {
    try {
      for (const [name, newsProvider] of Object.entries(NEWS_PROVIDERS)) {
        const raw = await news.getFrontPageNews(newsProvider.endpoint);
        const parsed = news.parseNewsJson(newsProvider, raw);
        news.cachedNews[newsProvider] = parsed;
        const hash = crypto.createHash('md5').update(JSON.stringify(parsed))
            .digest('hex');
        console.log(`${new Date().toISOString()}: Updated ${name}, hash: ${
          hash}.`);
      }
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = news;
