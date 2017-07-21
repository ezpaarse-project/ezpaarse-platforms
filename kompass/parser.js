#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Kompass
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/([a-z]+)$/i.exec(path)) !== null) {
    // http://fr.kompass.com/easybusiness#/detail/10/0
    result.rtype  = 'FICHE_ENTREPRISE';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/([a-z-]+)\/([a-z]+)\/([a-z]+)/i.exec(path)) !== null) {
    // https://fr.kompass.com/my-account/easybusiness/history#/
    result.rtype  = 'FICHE_ENTREPRISE';
    result.mime   = 'HTML';
    result.unitid = match[2];
  }

  return result;
});

