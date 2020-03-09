#!/usr/bin/env node

/**
 * parser for http://publish.aps.org platform
 * http://analyses.ezpaarse.org/platforms/aps/
 * update 2015/03/30
 * http://analyses.ezpaarse.org/platforms/aps/start-2
 */
'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(url) {
  let result = {};
  let path   = url.pathname;
  let match;


  if ((match = /^\/articles\/(v.*)$/i.exec(path)) !== null) {
    // http://physics.aps.org/articles/v7/7
    result.title_id = (url.hostname || '').replace('.aps.org', '');
    result.unitid   = result.title_id + '/' + match[1];
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

  } else if ((match = /^\/articles\/pdf\/(.*)$/i.exec(path)) !== null) {
    // http://physics.aps.org/articles/pdf/10.1103/Physics.6.140
    result.title_id = (url.hostname || '').replace('.aps.org', '');
    result.unitid   = match[1];
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';

  } else if ((match = /^\/(([a-zA-Z]+)\/issues\/[0-9]+\/[0-9]+)$/i.exec(path)) !== null) {
    // http://journals.aps.org/pra/issues/91/1
    result.unitid   = match[1];
    result.title_id = match[2];
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-zA-Z]+)\/(abstract|pdf|article)\/([0-9.]+\/[a-zA-Z0-9.]+)(\/figures)?/i.exec(path)) !== null) {
    // http://journals.aps.org/pra/abstract/10.1103/PhysRevA.91.010501
    // http://journals.aps.org/pra/article/10.1103/PhysRevA.91.032105/section/fulltext
    // http://journals.aps.org/pra/pdf/10.1103/PhysRevA.91.033602
    result.title_id = match[1];
    result.unitid   = match[3];
    result.doi      = match[3];

    switch (match[2]) {
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'article':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    }
    if (match[4]) {
      result.rtype = 'FIGURE';
    }

  } else if ((match = /^\/toc\/(([a-zA-Z]+)\/v[a-zA-Z0-9]+\/i[a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // http://prl.aps.org.bases-doc.univ-lorraine.fr/toc/PRL/v111/i25
    result.unitid   = match[1];
    result.title_id = match[2];
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/abstract\/(([a-zA-Z]+)\/v[a-zA-Z0-9]+\/i[a-zA-Z0-9]+\/(e|p)[a-zA-Z0-9_]+)$/i.exec(path)) !== null) {
    // http://prl.aps.org.bases-doc.univ-lorraine.fr/abstract/PRL/v111/i25/e250402
    result.unitid   = match[1];
    result.title_id = match[2];
    result.rtype    = 'ABS';
    result.mime     = 'HTML';

  } else if ((match = /^\/pdf\/(([a-zA-Z]+)\/v[a-zA-Z0-9]+\/i[a-zA-Z0-9]+\/(e|p)[a-zA-Z0-9_]+)$/i.exec(path)) !== null) {
    // http://prl.aps.org.bases-doc.univ-lorraine.fr/pdf/PRL/v111/i25/e251302
    result.unitid   = match[1];
    result.title_id = match[2];
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';

  } else if ((match = /^\/featured-article-pdf\/(10\.[0-9]+\/([a-z0-9.+_-]+))$/i.exec(path)) !== null) {
    // /featured-article-pdf/10.1103/PhysRevLett.124.096001
    result.doi    = match[1];
    result.unitid = match[2];
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';

  }

  return result;
});
