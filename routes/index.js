const express = require('express');
const router = new express.Router();
const request = require('request-promise-native');
const jsonPath = require('jsonpath');

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

router.get('/:newsProvider', async (req, res) => {
  try {
    const newsProvider = NEWS_PROVIDERS[req.params.newsProvider];
    if (typeof newsProvider === 'undefined') {
      return res.render('error', {providers: Object.keys(NEWS_PROVIDERS)});
    }
    const raw = await getFrontPageNews(newsProvider.endpoint);
    const parsed = [];
    Object.keys(newsProvider.article).forEach((key) => {
      let temp = jsonPath.nodes(raw, newsProvider.article[key].path);
      temp = newsProvider.article[key].postprocess(temp);
      temp.forEach((item, i) => {
        parsed[i] = parsed[i] || {
          '@context': 'http://schema.org',
          '@type': 'NewsArticle',
          'publisher': newsProvider.publisher,
        };
        parsed[i][key] = item;
      });
    });
    res.render('index', {
      articles: parsed,
      locale: newsProvider.locale,
    });
  } catch (e) {
    return res.render('error', {providers: Object.keys(NEWS_PROVIDERS)});
  }
});

module.exports = router;
