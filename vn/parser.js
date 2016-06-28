#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Vocalble Numérique
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

  if ((match = /^\/fr\/([a-zA-z0-9]+).asp$/.exec(path)) !== null) {
    // /fr/pvPageH5B.asp?puc=005879&nu=736&pa=1#8
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    if (param.nu) {
      result.unitid   = param.nu;
    }

  } else if ((match = /^\/basearticle\/([a-z]+)\/([0-9]+)\/(([\w\W]+).pdf)$/.exec(path)) !== null) {
    ///basearticle/artfiles/4184/Pages%20de%20VocGB715-2.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[2] + '/' + match[3];
  } else if ((match = /^\/numerique\/([a-z]+)\/([\w\W]+)$/.exec(path)) !== null) {
    //numerique/learning/recherche#video-youtube
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';

  } else if ((match = /^\/services\/([a-z]+)\/dwlaudio.php$/.exec(path)) !== null) {
    //services/vocablearticles/dwlaudio.php?pub=es2&num=687&piste=2&tmpid=f74a7669695a72deb13658959673a444
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';

  } else if ((match = /^\/basearticle\/([a-z]+)\/(([\w\W]+).pdf)$/.exec(path)) !== null) {
    ////basearticle/reglepdf/VOCplusESP687%2015.pdf
    result.rtype    = 'SUPPL';
    result.mime     = 'PDF';
    result.unitid   = match[2];
  }

  return result;
});

