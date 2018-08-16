#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let param = parsedUrl.query || {};
  let path  = parsedUrl.pathname;
  let match;

  //ancienne plateforme
  if ((match = /^\/weblextenso\/article\/afficher$/i.exec(path)) !== null) {
    // http://www.lextenso.fr/weblextenso/article/afficher
    if (param['id']) {
      let id = param['id'];

      if ((match = /([A-Z]+)([0-9]+)-([^-]+)-([^-]+)/.exec(id)) !== null) {
        // http://www.lextenso.fr/weblextenso/article/afficher?id=CAPJA2013-1-002&d=3575203170535
        result.title_id = match[1];
        result.rtype    = 'ARTICLE';
        result.mime     = 'HTML';
      } else if ((match = /^(C[A-Z0-9]+)/.exec(id)) !== null) {
        // http://www.lextenso.fr/weblextenso/article/afficher?id=C010IXCXCX2001X12X01X00177X053&origin=recherche;1&d=3575204329777
        // confirm title_id value for jurisprudence
        result.title_id = match[1];
        result.rtype    = 'JURISPRUDENCE';
        result.mime     = 'HTML';
      } else {
        console.log('unrecognized id : ' + id);
      }
      if (param['d']) {
        result.unitid = param['d'];
      }
    }
  }

  // nouvelle plateforme
  else if ((match = /^\/numero_revue\/(([a-z-]+)\/[0-9]+\/[0-9]+\/[0-9,]+)$/i.exec(path)) !== null) {
    //numero_revue/bulletin-joly-bourse/158/3/1456786800
    //numero_revue/flash-defrenois/163/7/1455663600%2C1456095600
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
  }

  else if ((match = /^\/lextenso\/ud\/urn:(([a-z-]+)[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // http://www.lextenso.fr/lextenso/ud/urn%3AEDCO2016023
    // http://www.lextenso.fr/lextenso/ud/urn%3APA201602013
    // http://www.lextenso.fr/lextenso/ud/urn%3ACONSTEXT000031256027

    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2].replace(/-+$/, '');

    if (result.title_id.toUpperCase().startsWith('CONSTEXT')) {
      result.rtype = 'JURISPRUDENCE';
    }
  }

  return result;
});
