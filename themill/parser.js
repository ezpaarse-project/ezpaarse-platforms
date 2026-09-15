#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

// Single-segment paths that are site pages rather than articles.
const SITE_PAGES = /^(about|all-our-stories)$/i;

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  // The Mill is a single publication running on Ghost, so an article is one
  // top-level slug and there is nothing between the article and the platform.
  // /burnham-advisor-no10-north/
  // /the-ira-men-behind-the-manchester-bomb-unravelling-a-mystery-after-30-years/
  //
  // Everything Ghost serves for itself carries a prefix and therefore has more
  // than one segment, so the anchor excludes it without a rule of its own:
  // /.ghost/analytics/api/v1/page_hit, /ghost/api/content/search-index/posts/,
  // /members/api/member/, /public/cards.min.js, /assets/css/style-min.css.
  // The site pages that do share the article shape are listed above.
  //
  // title_id is deliberately not set. The slug is an article headline, not a
  // title, and The Mill is one publication, so there is no title to resolve
  // and no knowledge base that applies.

  if ((match = /^\/([a-z0-9][a-z0-9-]*)\/?$/i.exec(path)) !== null) {
    if (!SITE_PAGES.test(match[1])) {
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
      result.unitid = match[1];
    }
  }

  return result;
});
