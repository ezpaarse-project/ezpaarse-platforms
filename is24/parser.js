#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Il Sole 24 Ore
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

  if ((match = /^\/art\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.ilsole24ore.com/art/ucraina-chi-e-bozambo-ongaro-miliziano-italiano-ucciso-donbass-AE8pfROB
    // https://www.ilsole24ore.com/art/covid-oggi-stop-prezzo-calmierato-i-ragazzi-anche-loro-tampone-15-euro-farmacia-AEf3MGOB
    //https://24plus.ilsole24ore.com/art/guerra-ucraina-rivincita-d-immagine-dell-intelligence-americana-AEQFD0NB
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1].substr(0, match[1].lastIndexOf('-'));
    result.unitid = match[1].substr(match[1].lastIndexOf('-')+1);

  }

  return result;
});
