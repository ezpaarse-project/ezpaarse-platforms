#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Hospimedia
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/fiches-pratiques\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // http://www.hospimedia.fr/fiches-pratiques/20241029-droit-quelles-sont-les-obligations-du-professionnel-de
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/studio\/medias\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // http://www.hospimedia.fr/studio/medias/20240911-les-rendez-vous-de-semaine-de-quatre-jours
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    result.unitid = match[1];

  } else if (/^\/recherche$/i.test(path)) {
    // http://www.hospimedia.fr/recherche?q=ehpad
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
