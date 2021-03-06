const fs = require('fs');
const express = require('express');
const router = new express.Router();
const news = require('../util/news.js');
let Intl;
// Use native Intl if possible
if (require('full-icu').icu_small) {
  Intl = require('intl');
}
const moment = require('moment');

const manifest = fs.readFileSync('./public/manifest.webmanifest', 'utf8');
const css = fs.readFileSync('./public/css/main.css', 'utf8');

const NEWS_PROVIDERS = {
  tagesschau: require('../schema_org-mappings/tagesschau'),
  bbc: require('../schema_org-mappings/bbc'),
};

router.get('/(:newsProvider/)?manifest.webmanifest', (req, res) => {
  res.setHeader('content-type', 'application/manifest+json');
  const newsProvider = NEWS_PROVIDERS[req.params.newsProvider];
  // Invalid news provider
  if (typeof newsProvider === 'undefined') {
    return res.send(manifest);
  }
  const dynamicManifest = JSON.parse(manifest);
  dynamicManifest.name = newsProvider.publisher.name;
  dynamicManifest.short_name = newsProvider.slug;
  dynamicManifest.icons = [newsProvider.icon];
  return res.send(dynamicManifest);
});

router.get('/(:newsProvider/)?main.css', (req, res) => {
  res.setHeader('content-type', 'text/css');
  const newsProvider = NEWS_PROVIDERS[req.params.newsProvider];
  // Invalid news provider
  if (typeof newsProvider === 'undefined') {
    return res.send(css);
  }
  const dynamicCss = css.replace(/:root\s*\{/,
      `:root{${newsProvider.css}`);
  return res.send(dynamicCss);
});

router.get('/(:newsProvider)?', async (req, res) => {
  try {
    const newsProvider = NEWS_PROVIDERS[req.params.newsProvider];
    // Invalid news provider
    if (typeof newsProvider === 'undefined') {
      return res.render('error', {
        providers: Object.keys(NEWS_PROVIDERS).map((newsProvider) => {
          return {
            publisher: NEWS_PROVIDERS[newsProvider].publisher,
            slug: NEWS_PROVIDERS[newsProvider].slug,
          };
        }),
      });
    }
    const slug = newsProvider.slug;
    // News have not been fetched yet
    if (!news.cachedNews[slug]) {
      return res.render('error', {
        providers: Object.keys(NEWS_PROVIDERS).map((newsProvider) => {
          return {
            publisher: NEWS_PROVIDERS[newsProvider].publisher,
            slug: NEWS_PROVIDERS[newsProvider].slug,
          };
        }),
        error: `News for ${newsProvider.publisher.name} not available yet`,
      });
    }
    // Return raw JSON
    if (req.query.raw !== undefined) {
      return res.json(news.cachedNews[slug]);
    }
    // Regular rendered return
    return res.render('index', {
      articles: news.cachedNews[slug],
      contentDistributions: news.contentDistributions[slug],
      locale: newsProvider.locale,
      publisher: newsProvider.publisher,
      slug: newsProvider.slug,
      icon: newsProvider.icon,
      home: req.params.newsProvider,
      Intl: Intl,
      duration: moment.duration,
    });
  } catch (error) {
    console.error(error);
    return res.render('error', {
      providers: Object.keys(NEWS_PROVIDERS).map((newsProvider) => {
        return {
          publisher: NEWS_PROVIDERS[newsProvider].publisher,
          slug: NEWS_PROVIDERS[newsProvider].slug,
        };
      }),
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
      slug: newsProvider.slug,
      icon: newsProvider.icon,
      home: req.params.newsProvider,
      Intl: Intl,
      duration: moment.duration,
    });
  } catch (error) {
    console.error(error);
    return res.render('error', {
      providers: Object.keys(NEWS_PROVIDERS).map((newsProvider) => {
        return {
          publisher: NEWS_PROVIDERS[newsProvider].publisher,
          slug: NEWS_PROVIDERS[newsProvider].slug,
        };
      }),
      error: error,
    });
  }
});

module.exports = router;
