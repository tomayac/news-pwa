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
    return new Error(`Invalid news provider "${url}".`);
  }
};

router.get('/:newsProvider', async (req, res) => {
  try {
    const newsProvider = NEWS_PROVIDERS[req.params.newsProvider];
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
    res.render('index', {articles: parsed});
  } catch (e) {
    res.status(400);
    res.send(`Fuck, got an error: ${e}`);
  }
});

module.exports = router;
