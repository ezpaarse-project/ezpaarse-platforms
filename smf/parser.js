#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Société Mathématique de France
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

  if ((match = /^(\/en)?\/[a-z]+\/(\/)?([a-z]+)\/([0-9]+)(\/([0-9]+))?\/(pdf|html)\/([a-z\_\-]+([0-9]+)\_([^.]+))\.(pdf|php)$/i.exec(path)) !== null) {
    ///en/Publications/Bulletin/144/pdf/smf_bull_144_1-52.pdf
    //Publications//SeminairesCongres/2015/29/pdf/smf_sem-cong_29_x+119.pdf
    //Publications/Bulletin/144/html/smf_bull_144_1-52.php
    result.rtype    = 'ARTICLE';
    result.mime     = match[7].toUpperCase();
    result.title_id = match[3];
    result.unitid   = match[8];
    if (match[5]) {
      result.publication_date = match[4];
      result.vol = match[6];
    } else {
      result.vol = match[4];
    }
    if (match[11] == 'php') {
      result.rtype = 'REF'
    }
  } else if ((match = /^(\/en)?\/[a-z]+\/([a-z\S]+)\//i.exec(path)) !== null) {
    //en/Publications/Bulletin/144/html/
    //Publications/Annale Sens/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2].split('/')[0];
  } else if ((match = /^\/RechercheSite\/$/i.exec(path)) !== null) {
    //http://smf4.emath.fr/RechercheSite/
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }




  return result;
});

