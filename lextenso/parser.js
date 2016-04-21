#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param = parsedUrl.query || {};
  var path  = parsedUrl.pathname;
  var match;
  var id;

  if ((match = /\/weblextenso\/article\/afficher/.exec(path)) !== null) {
    // http://www.lextenso.fr/weblextenso/article/afficher
    if (param['id']) {
      id = param['id'];
      if ((match = /([A-Z]+)([0-9]+)-([^\-]+)-([^\-]+)/.exec(id)) !== null) {
        // http://www.lextenso.fr/weblextenso/article/afficher?id=CAPJA2013-1-002&d=3575203170535
        result.title_id = match[1];
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
      } else if ((match = /^(C[A-Z0-9]+)/.exec(id)) !== null) {
        // http://www.lextenso.fr/weblextenso/article/afficher?id=C010IXCXCX2001X12X01X00177X053&origin=recherche;1&d=3575204329777
        // confirm title_id value for jurisprudence
        result.title_id = match[1];
        result.rtype = 'JURISPRUDENCE';
        result.mime = 'HTML';
      } else {
        console.log('unrecognized id : ' + id);
      }
      if (param['d']) {
        result.unitid = param['d'];
      }
    }
  } else if ((match = /\/([a-z\_]+)\/([a-z\-]+)\/([0-9]+)\/([0-9]+)\/([0-9\,]+)$/.exec(path)) !== null) {
    //numero_revue/bulletin-joly-bourse/158/3/1456786800
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = match[2];
  } else if ((match = /\/([a-z]+)\/([a-z]+)\/([a-zA-Z0-9\:]+)$/.exec(path)) !== null) {
    //lextenso/ud/urn%3AEDCO2016023
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[3].split(':')[1];
  }

  return result;
});
