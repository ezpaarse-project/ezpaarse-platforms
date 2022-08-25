#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Société Mathématique de France
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^(\/en)?\/[a-z]+\/+([a-z]+)\/([0-9]+)(\/([0-9]+))?\/(pdf|html)\/([a-z_-]+[0-9]+_[^.]+)\.(pdf|php)$/i.exec(path)) !== null) {
    ///en/Publications/Bulletin/144/pdf/smf_bull_144_1-52.pdf
    //Publications//SeminairesCongres/2015/29/pdf/smf_sem-cong_29_x+119.pdf
    //Publications/Bulletin/144/html/smf_bull_144_1-52.php
    result.mime     = match[6].toUpperCase();
    result.title_id = match[2];
    result.unitid   = match[7];

    if (match[4]) {
      result.publication_date = match[3];
      result.vol = match[5];
    } else {
      result.vol = match[3];
    }
    if (match[8] == 'php') {
      result.rtype = 'RECORD_VIEW';
    }
  } else if ((match = /^(\/en)?\/[a-z]+\/([a-z\s]*)\/([0-9/]+)?([a-z/]+)?/i.exec(path)) !== null) {
    //en/Publications/Bulletin/144/html/
    //Publications/Annale Sens/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];

  } else if ((match = /^\/RechercheSite\/$/i.exec(path)) !== null) {
    //http://smf4.emath.fr/RechercheSite/
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }
  return result;
});

