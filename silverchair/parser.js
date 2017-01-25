#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform silverchair
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  let match;

  if ((match = /^\/data\/Journals\/([a-zA-Z]*)\/[0-9]+\/([a-zA-Z0-9\_]*).pdf$/i.exec(path)) !== null) {
    // /data/Journals/JOTUEI/935001/turbo_138_06_061004.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if (/^\/article\.aspx$/i.test(path)) {
    // http://turbomachinery.asmedigitalcollection.asme.org/article.aspx?articleID=2478820
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';

    if (param.articleID) {
      result.unitid = param.articleID;
    }

  } else if (/^\/issue\.aspx$/i.test(path)) {
    // http://turbomachinery.asmedigitalcollection.asme.org/issue.aspx?journalid=135&issueid=935001&direction=P
    // http://appliedmechanicsreviews.asmedigitalcollection.asme.org/issue.aspx?journalid=113&issueid=935281&direction=P
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = param.journalid || parsedUrl.hostname.split('.')[0];

    if (param.issueid) {
      result.unitid = param.issueid;
    }
  } else if ((match = /^\/journals\/([a-z]+)\/(fullarticle|article-abstract)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://jamanetwork.com/journals/jama/fullarticle/2481003
    // http://jamanetwork.com/journals/jama/article-abstract/2480993
    result.title_id = match[1];
    result.unitid   = match[3];

    switch (match[2]) {
    case 'fullarticle':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'article-abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    }

  } else if ((match = /^\/journals\/([a-z]+)\/[a-z]+\/Journals\/[a-zA-Z]*\/[0-9]+\/([a-zA-Z0-9]*)\.pdf$/i.exec(path)) !== null) {
    // http://jamanetwork.com//journals/jama/data/Journals/JAMA/934847/joi150160.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^(\/journals)?\/([a-z]+)\/issue\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://jamanetwork.com/journals/jama/issue/315/2
    // /toxsci/issue/29/1
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[2];
    result.vol      = match[3];

  } else if ((match = /^\/[a-z]+\/backfile\/Content_public\/Journal\/([a-z]+)\/([0-9]+)\/[0-9]+\/([0-9]{2}\.[0-9]{4}\/([a-z]+\/[0-9\.]+))\/[0-9]+\/[0-9\-]*.pdf$/i.exec(path)) !== null) {
    // /oup/backfile/Content_public/Journal/toxsci/29/1/10.1093/toxsci/29.1.18/2/29-1-18.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.vol      = match[2];
    result.doi      = match[3];
    result.unitid   = match[4];

  } else if ((match = /^\/([a-z]+)\/(article|article-abstract)\/([0-9]+)\/[0-9]+\/([0-9]+)\/([0-9]+)\/[a-zA-Z\-]+$/i.exec(path)) !== null) {
    // /humrep/article/32/1/14/2645576/Is-the-understanding-of-AMH-being-confounded-by
    result.mime       = 'HTML';
    result.rtype      = match[2] === 'article' ? 'ARTICLE' : 'ABS';
    result.title_id   = match[1];
    result.vol        = match[3];
    result.first_page = match[4];
    result.unitid     = match[5];

  }

  return result;
});
