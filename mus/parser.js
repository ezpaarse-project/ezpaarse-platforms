#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Musicanet.org
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/bdd\/[a-z]{2}\/composer\/([0-9]+)\/[a-z]+$/i.exec(path)) !== null) {
    // /bdd/en/composer/33088/al
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/bdd\/[a-z]{2}\/score\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /bdd/en/score/190445-l-ocean-dominique-a
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
