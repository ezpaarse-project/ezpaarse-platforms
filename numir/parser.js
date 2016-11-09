#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Monographies Numérisées des bibliothèques Mathématiques Informatique Recherche des Universités Paris Diderot et Pierre et Marie Curie
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/articles\/articles.php$/.exec(path)) !== null) {
    // http://www.numir.org/articles/articles.php?id=171&cat=5
    result.rtype = 'BOOK';
    result.mime  = 'PDFPLUS';
    if (param) {
      result.title_id = param.id;
      result.unitid   = param.cat;
    }
  } else if ((match = /^\/articles\/bibtex.php$/.exec(path)) !== null) {
    // http://www.numir.org/articles/bibtex.php?id=AMAS_1999_136
    result.rtype = 'REF';
    result.mime  = 'BIBTEX';
    if (param && param.id) {
      result.title_id         = param.id.split('_')[0];
      result.publication_date = param.id.split('_')[1];
      result.vol              = param.id.split('_')[2];
      result.unitid           = param.id;
    }

  } else if ((match = /^\/ouvrage\/([A-Z]+)\/([\w\_]+)\/(([A-Z]+)\_([0-9]{4})\_([0-9]+)).pdf$/.exec(path)) !== null) {
    // http://www.numir.org/ouvrage/AOM/AOM_1985_10/AOM_1985_10.pdf
    result.rtype            = 'BOOK';
    result.mime             = 'PDF';
    result.title_id         = match[1];
    result.publication_date = match[5];
    result.unitid           = match[3];

  }

  return result;
});

