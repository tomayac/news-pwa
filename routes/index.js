const express = require('express');
const router = new express.Router();
const news = require('../util/news.js');
let Intl;
// Use native Intl if possible
if (require('full-icu').icu_small) {
  Intl = require('intl');
}
const moment = require('moment');

const NEWS_PROVIDERS = {
  tagesschau: require('../schema_org-mappings/tagesschau'),
};

router.get('/(:newsProvider)?', async (req, res) => {
  try {
    const newsProvider = NEWS_PROVIDERS[req.params.newsProvider];
    // Invalid news provider
    if (typeof newsProvider === 'undefined') {
      return res.render('error', {providers: Object.keys(NEWS_PROVIDERS)});
    }
    // News have not been fetched yet
    if (!news.cachedNews[newsProvider]) {
      return res.render('error', {
        providers: Object.keys(NEWS_PROVIDERS),
        error: `News for ${newsProvider.publisher.name} not available yet`,
      });
    }
    // Return raw JSON
    if (req.query.raw !== undefined) {
      return res.json(news.cachedNews[newsProvider]);
    }
    // Regular rendered return
    return res.render('index', {
      articles: news.cachedNews[newsProvider],
      contentDistributions: news.contentDistributions[newsProvider],
      locale: newsProvider.locale,
      publisher: newsProvider.publisher,
      home: req.params.newsProvider,
      Intl: Intl,
      duration: moment.duration,
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
    const raw = await news.getFrontPageNews(
        `${newsProvider.endpoint}${section}/${article}.json`);
    const parsed = news.parseNewsJson(newsProvider, {news: [raw]});
    if (req.query.raw !== undefined) {
      return res.json(parsed);
    }
    return res.render('index', {
      articles: parsed,
      locale: newsProvider.locale,
      publisher: newsProvider.publisher,
      home: req.params.newsProvider,
      Intl: Intl,
      duration: moment.duration,
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
