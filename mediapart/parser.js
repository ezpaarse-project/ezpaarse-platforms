#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations du journal d'information numérique Mediapart
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;
  if ((match = /^\/journal\/(audio.*)$/.exec(path)) !== null) {
    // http://www.mediapart.fr/journal/audio/des-passe-droits-permettent-la-famille-royale-du-qatar-d-acheter-un-palace
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  }
  else if ((match = /^\/pdf\/(.*)$/.exec(path)) !== null) {
    // http://www.mediapart.fr/pdf/479315
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }
  else if ((match = /^\/((e[ns]\/)?journal.*)$/.exec(path)) !== null) {
    // http://www.mediapart.fr/journal/france/071214/contre-les-violences-policieres-la-mobilisation-sorganise
    // http://www.mediapart.fr/es/journal/international/261114/un-oleoducto-gigante-amenaza-canada-y-europa (article espagnol)
    // http://www.mediapart.fr/en/journal/france/121214/revealed-le-pens-third-russian-loan (article anglais)
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }
  return result;
});

