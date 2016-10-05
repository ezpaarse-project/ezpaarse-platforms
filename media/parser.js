#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Media Cite de la Musique 
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

  if ((match = /^\/[a-z]+\/doc\/[A-Z]+\/[A-Z]+\/([0-9]+)\/([\w\-]+)$/.exec(path)) !== null) {
    ///medias/doc/EXTRANET/CIMU/0941724/carla-bley-the-lost-chords-find-paolo-fresu
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/[A-Z]+\/[a-z]+\/player.aspx$/.exec(path)) !== null) {
    //EXTRANET/ermes/player.aspx?id=0941724
    result.rtype = 'VIDEO';
    result.mime  = 'MISC';
    if (param.id) {
      result.unitid = param.id;
    }

  }

  return result;
});

