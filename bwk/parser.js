#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bouwkosten
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

  if (/^\/zoeken\.aspx$/i.test(path)) {
    // https://www.bouwkosten.nl/zoeken.aspx?question=kosten
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/tools\/[a-z]+\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://www.bouwkosten.nl/tools/onwerkbaarweer/toelichting-onwerkbaar-weer
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/[a-z_]+\/[a-z_]+\/.+\/.+\/([0-9]+)\.htm$/i.exec(path)) !== null) {
    // https://www.bouwkosten.nl/Ontdoeningskosten_afvalstoffen/Asbestverwijdering/Kosten_asbestsanering,_eenheidsprijs/kostengegevens-Prijzen,_Normen_en_Tarieven/1494335.htm
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
