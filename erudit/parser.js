#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const doiPrefix = '10.7202';

module.exports = new Parser(function analyseEC(parsedUrl) {
  const result   = {};
  const param    = parsedUrl.query || {};
  const pathname = parsedUrl.pathname;

  let match;

  if ((match = /^\/revue\/(([a-z]+)\/([0-9]{4})\/v([0-9]*)\/n([0-9]*)\/([a-z0-9]+))\.(html|pdf)$/i.exec(pathname)) !== null) {
    // /revue/ac/1974/v7/n1/index.html
    // /revue/ac/1974/v7/n1/017030ar.html?vue=resume

    if (match[6] === 'index') {
      result.rtype = 'TOC';
      result.mime  = 'MISC';
    } else {
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
      result.unitid = match[6];
      result.doi    = `${doiPrefix}/${match[6]}`;
    }

    result.title_id = match[2];
    result.publication_date = match[3];

    if (match[4]) {
      result.vol = match[4];
    }
    if (match[5]) {
      result.issue = match[5];
    }

    if (param.vue === 'resume') {
      // /revue/ac/1974/v7/n1/017030ar.html?vue=resume
      result.rtype = 'ABS';
      result.mime  = 'HTML';

    } else if (param.vue === 'biblio') {
      // /revue/crimino/2013/v46/n1/1015292ar.html?vue=biblio&mode=restriction
      result.rtype = 'REF';
      result.mime  = 'HTML';

    } else if (match[7] === 'pdf') {
      // /revue/ae/2010/v86/n4/1005678ar.pdf
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
    }

  } else if ((match = /^\/livre\/((([a-z]+)\/([0-9]{4}))\/([a-z0-9_-]+))\.(htm|pdf)$/i.exec(pathname)) !== null) {
    // /livre/crir/2007/livrel6_div4.pdf
    // /livre/carleym/2001/index.htm
    // /livre/carleym/2001/livrel2_div7.htm
    result.rtype    = match[5] === 'index' ? 'ABS' : 'BOOK_SECTION';
    result.mime     = match[6] === 'htm' ? 'HTML': 'PDF';
    result.unitid   = match[5] === 'index' ? match[2] : match[1];
    result.title_id = match[3];

    result.publication_date = match[4];

  } else if ((match = /^\/[a-z]{2,3}\/revues\/([a-z]+)\/(([0-9]{4})-n([0-9]+)-[a-z0-9]+)\/?$/i.exec(pathname)) !== null) {
    // /fr/revues/recma/2012-n326-recma0683/
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[2];
    result.issue    = match[4];

    result.publication_date = match[3];

  } else if ((match = /^\/[a-z]{2,3}\/revues\/([a-z]+)\/([0-9]{4})-n([0-9]+)-[a-z0-9]+\/([a-z0-9]+)(\/|\.pdf)?$/i.exec(pathname)) !== null) {
    // /fr/revues/recma/2012-n326-recma0683/1016866ar/
    // /fr/revues/recma/2012-n326-recma0683/1016866ar.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = match[5] === '/' ? 'HTML' : 'PDF';
    result.title_id = match[1];
    result.issue    = match[3];
    result.unitid   = match[4];
    result.doi      = `${doiPrefix}/${match[4]}`;

    result.publication_date = match[2];

  } else if (/^\/livre\/?$/i.test(pathname)) {
    // /livre/
    result.rtype = 'TOC';
    result.mime  = 'MISC';
  }

  return result;
});
