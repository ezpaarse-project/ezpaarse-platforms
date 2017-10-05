#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Acland's Video Atlas of Human Anatomy
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const param  = parsedUrl.query || {};

  switch (path.toLowerCase()) {
  case '/multimediaplayer.aspx':
    // http://aclandanatomy.com/MultimediaPlayer.aspx?multimediaId=10528543
    result.rtype  = 'VIDEO';
    result.mime   = 'HTML';
    result.unitid = param.multimediaId;
    break;
  case '/multimedia.aspx':
    // http://aclandanatomy.com/Multimedia.aspx?categoryid=39464
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = param.categoryid;
    break;
  case '/atozresults.aspx':
    // http://aclandanatomy.com/atozresults.aspx?resourceindex=16&displayname=abdominal+arteries
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.resourceindex;
    result.title_id = param.displayname;
    break;
  }

  return result;
});

