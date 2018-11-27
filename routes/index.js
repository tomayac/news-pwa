const express = require('express');
const router = new express.Router();
const request = require('request-promise-native');
const jsonPath = require('jsonpath');
let Intl;
if (require('full-icu').icu_small) {
  Intl = require('intl');
}

const NEWS_PROVIDERS = {
  tagesschau: require('../schema_org-mappings/tagesschau'),
};

const getFrontPageNews = async (url) => {
  try {
    const options = {
      url: url,
      json: true,
      headers: {
        'User-Agent': 'News PWA Demo (thomas.steiner@upc.edu)',
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
};

router.get('/(:newsProvider)?', async (req, res) => {
  try {
    const newsProvider = NEWS_PROVIDERS[req.params.newsProvider];
    if (typeof newsProvider === 'undefined') {
      return res.render('error', {providers: Object.keys(NEWS_PROVIDERS)});
    }
    const raw = await getFrontPageNews(newsProvider.endpoint);
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
    parsed = parsed.map((item) => {
      if (item.author === undefined) {
        // If there is no named `author`, the `author` is the `publisher`
        item.author = newsProvider.publisher;
      }
      return item;
    }).filter((item) => {
      // Only consider articles with an `articleBody`
      return item.articleBody;
    });
    if (req.query.raw !== undefined) {
      return res.json(parsed);
    }
    return res.render('index', {
      articles: parsed,
      locale: newsProvider.locale,
      publisher: newsProvider.publisher,
      home: req.params.newsProvider,
      Intl: Intl,
    });
  } catch (error) {
    console.error(error);
    return res.render('error', {
      providers: Object.keys(NEWS_PROVIDERS),
      error: error,
    });
  }
});

module.exports = router;
