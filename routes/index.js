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
    return await request.get(options);
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
      for (let i = 0, lenI = temp.length; i < lenI; i++) {
        const item = temp[i];
        parsed[i] = parsed[i] || {
          '@context': 'http://schema.org',
          '@type': 'NewsArticle',
        };
        parsed[i][key] = item;
        parsed[i].publisher = newsProvider.publisher;
      }
    });
    parsed = parsed.filter((item) => item.articleBody);
    return res.render('index', {
      articles: parsed,
      locale: newsProvider.locale,
      publisher: newsProvider.publisher,
      Intl: Intl,
    });
  } catch (e) {
    console.error(e);
    return res.render('error', {providers: Object.keys(NEWS_PROVIDERS)});
  }
});

module.exports = router;
