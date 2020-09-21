#!/usr/bin/env node

/**
 * parser for wiley platform
 * http://analyses.ezpaarse.org/platforms/wiley/
 */
'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/pdf\/(10\.[0-9]+\/([0-9x]+))(\.ch[0-9]+)$/i.exec(path)) !== null) {
    // /pdf/10.1002/9781118638323.ch3
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'PDF';
    result.doi    = match[1];
    result.unitid = `${match[2]}${match[3]}`;
    result.online_identifier = match[2];

  } else if ((match = /^\/doi(\/[a-z]+)?\/(10\.[0-9]+\/([a-z0-9._-]+?))(\.fmatter)?$/i.exec(path)) !== null) {
    result.doi    = match[2];
    result.unitid = match[3];

    if (!match[1]) {
      // /doi/10.1002/brb3.590
      // /doi/10.1002/9780470294635.ch44
      result.rtype = /\.ch[0-9]+$/.test(result.unitid) ? 'BOOK_SECTION' : 'ARTICLE';
      result.mime  = 'HTML';
      return result;
    }

    switch (match[1]) {
    case '/pdf':
    case '/epdf':
    case '/pdfdirect':
      // /doi/pdf/10.1002/brb3.590
      // /doi/epdf/10.1002/brb3.590
      result.rtype = /\.ch[0-9]+$/.test(result.unitid) ? 'BOOK_SECTION' : 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case '/full':
      // /doi/full/10.1002/brb3.590
      result.rtype = /\.ch[0-9]+$/.test(result.unitid) ? 'BOOK_SECTION' : 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case '/abs':
      // /doi/abs/10.1002/brb3.590
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case '/book':
      // /doi/book/10.1002/047084289X
      result.rtype = 'TOC';
      result.mime  = 'MISC';
      break;
    }

    if (match[4]) {
      // /doi/pdf/10.1002/9781118843109.fmatter
      result.rtype = 'BOOK_SECTION';
      result._granted = false;
    }

  } else if ((match = /^\/toc\/toc\/(([0-9]+)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // /toc/toc/21579032/7/1
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.vol      = match[3];
    result.issue    = match[4];

  } else if ((match = /^\/journal\/([0-9]+)$/i.exec(path)) !== null) {
    // /journal/21579032
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];

  } else if ((match = /\/journal\/(10\.[0-9]+\/(\(ISSN\)([0-9]{4}-[0-9]{3}[0-9xX])))/i.exec(path)) !== null) {
    // /journal/10.1111/%28ISSN%291600-5724
    result.doi    = match[1];
    result.unitid = match[2];
    result.rtype  = 'TOC';
    result.mime   = 'MISC';

    result.online_identifier = match[3];

  } else if ((match = /^(?:\/wol1)?\/doi\/(10\.[0-9]+\/([^/]+?(\.ch[0-9]+)?))\/([a-z]+)(\/standard|\/abstract)?(?:;|$)/i.exec(path)) !== null) {
    // /doi/10.1111/aar.2012.83.issue-1/issuetoc
    // /doi/10.1111/j.1600-0390.2012.00514.x/abstract
    // /doi/10.1002/anie.201209878/abstract
    // /doi/10.1107/S1399004715000292/abstract
    // /doi/10.1111/acv.12024/full
    // /doi/10.1111/j.1600-0390.2012.00514.x/pdf
    // /doi/10.1002/anie.201209878/pdf
    // /doi/10.1002/9781118268117.ch3/pdf
    // /doi/10.1107/S1399004715000292/pdf
    // /doi/10.1107/S139900471402286X/pdf
    // /doi/10.1002/2015TC003829/pdf
    // /doi/10.1029/JZ072i023p05799/pdf
    // /doi/10.1111/cen.12587/pdf;jsessionid=9621F8B2E364EF903D466A193C278D6F.f01t02
    // /doi/10.1002/14651858.CD003916.pub3/pdf/abstract
    // /doi/10.1002/14651858.CD001886.pub2/epdf/standard
    // /wol1/doi/10.1111/j.1600-065X.2006.00454.x/full

    result.doi    = match[1];
    result.unitid = match[2];

    switch (match[4]) {
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'pdf':
    case 'epdf':
      result.rtype = match[3] ? 'BOOK_SECTION' : 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'full':
      result.rtype = match[3] ? 'BOOK_SECTION' : 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'issuetoc':
      result.rtype = 'TOC';
      result.mime  = 'MISC';
      break;
    }

    if (match[5] === '/abstract') {
      result.rtype = 'ABS';
    }

  } else if ((match = /^\/book\/(10\.[0-9]+\/([0-9]+))$/i.exec(path)) !== null) {
    // /book/10.1002/9781118268117
    result.doi      = match[1];
    result.unitid   = match[2];
    result.title_id = match[2].toUpperCase();
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

    result.print_identifier = match[2];

  } else if ((match = /^\/enhanced\/doi\/(10\.[0-9]+\/(([^.]+)\.[^/]+))\/?$/i.exec(path)) !== null) {
    // /enhanced/doi/10.1002/cjg2.20083/
    result.doi      = match[1];
    result.unitid   = match[2];
    result.title_id = match[3].toUpperCase();
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

  } else if ((match = /^\/enhanced\/doi\/(10\.[0-9]+\/(([0-9]{4})([a-z0-9]{2})[a-z0-9]+))\/?$/i.exec(path)) !== null) {
    // /enhanced/doi/10.1002/2013WR014994/

    result.doi      = match[1];
    result.unitid   = match[2];
    result.title_id = match[4].toUpperCase();
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

    result.publication_date = match[3];

  } else if ((match = /^\/agu\/issue\/(10\.[0-9]+\/(([^.]+)\.[^/]+))\/?$/i.exec(path)) !== null) {
    // /agu/issue/10.1002/jgrd.v119.14/
    result.doi      = match[1];
    result.unitid   = match[2];
    result.title_id = match[3].toUpperCase();
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/iucr\/(10\.[0-9]+\/([a-z]{1}[0-9a-z]+))/i.exec(path)) !== null) {
    // /iucr/10.1107/S1399004715000292
    // /iucr/10.1107/S139900471402286X
    result.doi    = match[1];
    result.unitid = match[2] ;
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';

  } else if ((match = /^\/store\/(10\.[0-9]+\/(([a-z]+)\.([0-9]{4})[0-9]+))\/asset\/[a-z]+[0-9]+.pdf$/i.exec(path)) !== null) {
    // /store/10.15252/embr.201439742/asset/embr201439742.pdf
    result.doi      = match[1];
    result.unitid   = match[2];
    result.title_id = match[3].toUpperCase();
    result.mime     = 'PDF';

    result.publication_date = match[4];

  } else if ((match = /^\/doi\/(pdf|epdf|abs)\/(10.[0-9]{4})\/([a-z0-9:.\-;()%<>]+)$/i.exec(path)) !== null) {
    // /doi/(pdf|epdf)/10.1002/%28SICI%291521-4001%28199906%2979%3A6%3C399%3A%3AAID-ZAMM399%3E3.0.CO%3B2-K
    result.doi      = `${match[2]}/${match[3]}`;
    result.unitid   = match[3];
    result.rtype    = match[1] === 'abs' ? 'ABS' : 'ARTICLE';
    result.mime     = match[1] === 'abs' ? 'HTML' : 'PDF';
  }

  return result;
});
