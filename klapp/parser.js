#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Klapp Online Bibliography of French Literature
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if ((/^\/cgi-bin\/koha\/opac-search.pl$/i.test(path)) || (/^\/cgi-bin\/koha\/browsen\/browse.pl$/i.test(path))) {
    // https://www.klapp-online.de:443/cgi-bin/koha/opac-search.pl?idx=kw&q=mueller&sort_by=pubdate_dsc&limit=au:Apel-Muller,%20Michel
    // https://www.klapp-online.de:443/cgi-bin/koha/browsen/browse.pl?lang=en&sid=2020_01_08__1578507694.38933&pos=5000+Dix-huiti%C3%83%C2%A8me+Si%C3%83%C2%A8cle
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';


  } else if (/^\/cgi-bin\/koha\/opac-detail.pl$/i.test(path)) {
    // https://www.klapp-online.de:443/cgi-bin/koha/opac-detail.pl?biblionumber=221418&query_desc=kw%2Cwrdl%3A%20mueller
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = param.biblionumber;

  } else if (/^\/cgi-bin\/koha\/printfile.pl$/i.test(path)) {
    // https://www.klapp-online.de:443/cgi-bin/koha/printfile.pl?file=1956-1990_klapp-online_de.html
    // https://www.klapp-online.de:443/cgi-bin/koha/printfile.pl?file=Bibliographie_der_franzoesischen_Literaturwissenschaft_Band_XIV_1976.pdf
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'MISC';
    result.unitid   = param.file;

  }

  return result;
});
