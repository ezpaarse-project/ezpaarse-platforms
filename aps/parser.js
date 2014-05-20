#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/

/**
 * parser for http://publish.aps.org platform
 * http://analogist.couperin.org/platforms/aps/
 */
'use strict';
var URL    = require('url');
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(url) {
  var result = {};
  var path   = decodeURIComponent(URL.parse(url).path);
  var domain   = url.hostname; /* Just the lowercased hostname portion of the host. Example: 'host.com' */

  var match;

  if (domain == 'physics.aps.org') {
    result.title_id  = domain.replace(".aps.org", "");
    if ((match = /^\/articles\/(v.*)/.exec(path)) !== null) {
      // example : http://physics.aps.org/articles/v7/7
      result.unitid = result.title_id + '/' + match[1];
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }
    else if ((match = /^\/articles\/pdf\/(.*)/.exec(path)) !== null) {
      // example : http://physics.aps.org/articles/pdf/10.1103/Physics.6.140
      result.unitid = match[1];
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }
  } else {
    if ((match = /\/toc\/(([a-zA-Z]+)\/v[a-zA-Z0-9]+\/i[a-zA-Z0-9]+)$/.exec(path)) !== null) {
      // http://prl.aps.org.bases-doc.univ-lorraine.fr/toc/PRL/v111/i25
      result.unitid = match[1];
      result.title_id = match[2];
      result.rtype = 'TOC';
      result.mime = 'HTML';
    } else if ((match = /\/abstract\/(([a-zA-Z]+)\/v[a-zA-Z0-9]+\/i[a-zA-Z0-9]+\/(e|p)[a-zA-Z0-9_]+)$/.exec(path)) !== null) {
      // http://prl.aps.org.bases-doc.univ-lorraine.fr/abstract/PRL/v111/i25/e250402
      result.unitid = match[1];
      result.title_id = match[2];
      result.rtype = 'ABS';
      result.mime = 'HTML';
    } else if ((match = /\/pdf\/(([a-zA-Z]+)\/v[a-zA-Z0-9]+\/i[a-zA-Z0-9]+\/(e|p)[a-zA-Z0-9_]+)$/.exec(path)) !== null) {
      // http://prl.aps.org.bases-doc.univ-lorraine.fr/pdf/PRL/v111/i25/e251302
      result.unitid = match[1];
      result.title_id = match[2];
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
    }
  }
  return result;
});
