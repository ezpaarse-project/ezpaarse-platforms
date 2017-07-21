#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Media Cite de la Musique
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/[a-z]+\/doc\/[A-Z]+\/[A-Z]+\/([0-9]+)\/([\w-]+)$/i.exec(path)) !== null) {
    ///medias/doc/EXTRANET/CIMU/0941724/carla-bley-the-lost-chords-find-paolo-fresu
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/[A-Z]+\/[a-z]+\/player.aspx$/i.exec(path)) !== null) {
    //EXTRANET/ermes/player.aspx?id=0941724
    result.rtype = 'VIDEO';
    result.mime  = 'MISC';
    if (param.id) {
      result.unitid = param.id;
    }

  }

  return result;
});

