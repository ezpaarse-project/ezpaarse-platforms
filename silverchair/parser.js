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
  let host   = parsedUrl.host;

  let match;

  if ((match = /^\/([a-z0-9_.-]+)\.pdf$/i.exec(path)) !== null) {
    // /dew237.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  } else if ((match = /^\/data\/Journals\/([a-z0-9]+)\/[0-9]+\/([a-z0-9_]+)\.pdf$/i.exec(path)) !== null) {
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

    if ((match = /^([a-z]+)\.asmedigitalcollection\.asme\.org/i.exec(host))) {
      result.title_id = match[1];
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

    if ((match = /^([a-z]+)\.asmedigitalcollection\.asme\.org/i.exec(host))) {
      result.title_id = match[1];
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

  } else if ((match = /^(?:\/journals)?\/([a-z]+)\/issue\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://jamanetwork.com/journals/jama/issue/315/2
    // /toxsci/issue/29/1
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.vol      = match[2];
    result.issue    = match[3];

  } else if ((match = /^\/[a-z]+\/(?:backfile\/)?Content_public\/Journal\/([a-z]+)\/([0-9]+)\/([0-9]+)\/(10\.[0-9]+)[/_]([a-z]+\/?[a-z0-9.-]+)\/[0-9]+\/[a-z0-9.-]+\.pdf$/i.exec(path)) !== null) {
    // /oup/backfile/Content_public/Journal/toxsci/29/1/10.1093/toxsci/29.1.18/2/29-1-18.pdf
    // /gsw/Content_public/Journal/jgs/172/1/10.1144_jgs2014-046/2/5.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.vol      = match[2];
    result.issue    = match[3];
    result.doi      = `${match[4]}/${match[5]}`;
    result.unitid   = match[5];

  } else if ((match = /^(?:\/[a-z]+)?\/([a-z]+)\/(article|article-abstract)\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([0-9]+)(?:\/[a-z-]+)?$/i.exec(path)) !== null) {
    // /humrep/article/32/1/14/2645576/Is-the-understanding-of-AMH-being-confounded-by
    // /segweb/economicgeology/article-abstract/108/1/1/128420/applying-stable-isotopes-to-mineral-exploration
    // /gsa/lithosphere/article/10/2/172/527223/the-role-of-calcite-rich-metasedimentary-mylonites
    // /bib/article/17/1/63/1742184
    result.mime       = 'HTML';
    result.rtype      = match[2] === 'article' ? 'ARTICLE' : 'ABS';
    result.title_id   = match[1];
    result.vol        = match[3];
    result.issue      = match[4];
    result.first_page = match[5];
    result.unitid     = match[6];

  }

  return result;
});
