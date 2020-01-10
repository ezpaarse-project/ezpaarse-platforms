#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform AtoZdatabases: Target Company Lists
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if ((/^\/search$/i.test(path)) || (/^\/ajax\/(getIndeedResults|cityAutocomplete).htm$/i.test(path))) {
    // https://www.atozdatabases.com:443/search
    // https://www.atozdatabases.com:443/ajax/getIndeedResults.htm?&Add_indeed_type=1&Add_query=&Add_location=Atlanta%2C+&Add_jobtype=-1&curDate=Thu+Jan+09+2020+18%3A48%3A45+GMT-0500+(Eastern+Standard+Time)&page=search&database=jobs&start=0
    // https://www.atozdatabases.com:443/ajax/cityAutocomplete.htm?city=Atlanta&database=combined&term=Atlanta
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (/^\/ajax\/getIndeedForDetails.htm$/i.test(path)) {
    // https://www.atozdatabases.com:443/ajax/getIndeedForDetails.htm?query=company:Maias%20Books%20&%20Misc&l=Columbus,OH&sort=&radius=&st=&jt=&start=&limit=2&fromage=&filter=&latlong=1&co=us&chnl=&userip=192.27.0.5&useragent=Mozilla/5.0%20(Windows%20NT%2010.0;%20Win64;%20x64;%20rv:56.0)%20Gecko/20100101%20Firefox/56.0%20Waterfox/56.3&v=2&format=json&callback=jobPortal&t=1578613626248
    result.rtype    = 'DATASET';
    result.mime     = 'HTML';
    result.unitid   = param.query;

  }

  return result;
});
