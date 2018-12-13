const express = require('express');
const router = new express.Router();
const news = require('../util/news.js');
let Intl;
if (require('full-icu').icu_small) {
  Intl = require('intl');
}

const NEWS_PROVIDERS = {
  tagesschau: require('../schema_org-mappings/tagesschau'),
};

news.updateCachedNews();
setInterval(news.updateCachedNews, 60000);

router.get('/(:newsProvider)?', async (req, res) => {
  try {
    const newsProvider = NEWS_PROVIDERS[req.params.newsProvider];
    if (typeof newsProvider === 'undefined') {
      return res.render('error', {providers: Object.keys(NEWS_PROVIDERS)});
    }
    if (!news.cachedNews[newsProvider]) {
      return res.render('error', {
        providers: Object.keys(NEWS_PROVIDERS),
        error: `News for ${newsProvider.publisher} not available yet`,
      });
    }
    if (req.query.raw !== undefined) {
      return res.json(news.cachedNews[newsProvider]);
    }
    return res.render('index', {
      articles: news.cachedNews[newsProvider],
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

router.get('/:newsProvider/:section/:article', async (req, res) => {
  try {
    const newsProvider = NEWS_PROVIDERS[req.params.newsProvider];
    if (typeof newsProvider === 'undefined') {
      return res.render('error', {providers: Object.keys(NEWS_PROVIDERS)});
    }
    const article = req.params.article;
    const section = req.params.section;
    const raw = await getFrontPageNews(`${newsProvider.endpoint}${section}/${
      article}.json`);
    const parsed = parseNewsJson(newsProvider, {news: [raw]});
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
