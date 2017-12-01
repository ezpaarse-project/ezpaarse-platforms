#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * [description-goes-here]
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let hostname = parsedUrl.hostname;
  let href   = parsedUrl.href;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/news\/((.*)\/(.*))$/i.exec(path)) !== null) {
    // https://www.economist.com:443/news/world-week/21731696-politics-week
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/blogs\/([a-z0-9-]*)/i.exec(path)) !== null) {
    // https://www.economist.com:443/blogs/graphicdetail/2017/11/daily-chart-23
    // http://www.economist.com:80/blogs/buttonwood
    // http://www.economist.com:80/blogs/buttonwood?id=2512631
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/search.*$/i.test(path)) {
    // https://www.economist.com:443/search?q=money
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (hostname === 'radio.economist.com') {
    // http://radio.economist.com:80/
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
  } else if ((match = /^\/features\/(.*)/i.exec(path)) !== null) {
    // https://www.1843magazine.com:443/features/the-monster-beneath
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/culture\/(.*)/i.exec(path)) !== null) {
    // https://www.1843magazine.com:443/culture/paradise-in-perm
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /.eiu\.com.*articleid=([0-9]*)/i.exec(href)) !== null) {
    // http://country.eiu.com:80/article.aspx?articleid=1676029351&Country=Ireland&topic=Economy&subtopic=Forecast&subsubtopic=Fiscal+policy+outlook
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/Webinar-Archive/i.test(path)) {
    // http://pages.eiu.com:80/Webinar-Archive.html
    result.publication_title = 'Intelligence Unit';
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  } else if ((match = /^\/debate\/([a-z-]*)/i.exec(path)) !== null) {
    // http://debates.economist.com:80/debate/online-pornography
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/videos\/((.*)\/(.*))/i.exec(path)) !== null) {
    // http://cdn.videos.rollcall.com/videos/201701/Biden_Being_Biden_03.webm
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/news\/((.*?)\/(.*))/i.exec(path)) !== null) {
    // http://www.rollcall.com:80/news/politics/joe-biden-returns-defend-bfd
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[3];
  } else if ((match = /eiu.com.*article_id=([0-9]*)/i.exec(href)) !== null) {
    // http://viewswire.eiu.com:80/index.asp?layout=RKArticleVW3&article_id=1046042488&refm=rkHome&page_title=Latest%20risk%20analysis&fs=true&fs=true
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/analysts\/([a-z-]*)/i.exec(path)) !== null) {
    // http://www.eiu.com:80/analysts/mohamed-abdelmeguid
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/economics-a-to-z.*/i.test(path)) {
    // http://www.economist.com:80/economics-a-to-z
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = 'economics-a-to-z';
  } else if ((match = /^\/industry\/article\/((.*)\/(.*)\/(.*))/i.exec(path)) !== null) {
    // http://www.eiu.com:80/industry/article/1196129903/isabel-dos-santos-loses-sonangol-position/2017-11-1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/blog\/(.*)$/i.exec(path)) !== null) {
    // https://execed.economist.com:443/blog/career-hacks/digital-distractions-make-leaders-less-influential
      result.rtype    = 'REF';
      result.mime     = 'HTML';
      result.title_id = match[1];
      result.unitid   = match[1];
  }

  if (result.mime != null) {
    if (/^execed.economist.com$/i.test(hostname)) {
      result.publication_title = 'Executive Education Navigator';
    } else if (/eiu.com$/i.test(hostname)) {
      result.publication_title = 'Intelligence Unit';
    } else if (/rollcall.com$/i.test(hostname)) {
      result.publication_title = 'Roll Call';
    } else if (/1843magazine.com$/i.test(hostname)) {
      result.publication_title = '1843 Magazine';
    } else {
      result.publication_title = 'The Economist';
    }
  }

  return result;
});
