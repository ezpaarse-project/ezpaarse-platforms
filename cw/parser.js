#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform CountryWatch
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/home\/search$/i.test(path)) {
    // http://www.countrywatch.com/home/search?q=Trump
    // http://www.countrywatch.com/home/search?q=Biden
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/intelligence\/countrywirestory$/i.test(path)) {
    // http://www.countrywatch.com/intelligence/countrywirestory?uid=7083883
    // http://www.countrywatch.com/intelligence/countrywirestory?uid=7083882
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.uid;
  } else if ((match = /^\/intelligence\/(mapsglobal|mapsdisplay)$/i.exec(path)) != null) {
    // http://www.countrywatch.com/intelligence/mapsdisplay?sectionid=1&catgoryid=1&subcategoryid=1&submenuid=1
    // http://www.countrywatch.com/intelligence/mapsdisplay?sectionid=2&catgoryid=4
    // http://www.countrywatch.com/intelligence/mapsglobal?globalsectionid=3&imageid=1
    // http://www.countrywatch.com/intelligence/mapsdisplay?sectionid=1&catgoryid=6&subcategoryid=1&submenuid=1
    result.rtype    = 'MAP';
    result.mime     = 'HTML';
    if (match[1] == 'mapsglobal') {
      result.unitid = `globalsectionid=${param.globalsectionid}&imageid=${param.imageid}`;
    } else if (param.subcategoryid != null) {
      result.unitid   = `sectionid=${param.sectionid}&catgoryid=${param.catgoryid}&subcategoryid=${param.subcategoryid}&submenuid=${param.submenuid}`;
    } else {
      result.unitid   = `sectionid=${param.sectionid}&catgoryid=${param.catgoryid}`;
    }
  } else if ((match = /^\/home\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // http://www.countrywatch.com/home/coronavirus?topic=sdcvd
    // http://www.countrywatch.com/home/coronavirus?topic=sdcvs
    result.rtype = 'TABLE';
    result.mime = 'HTML';
    result.unitid = `${match[1]}?topic=${param.topic}`;
  } else if (/^\/elections\/profile$/i.test(path)) {
    // http://www.countrywatch.com/elections/profile?countryid=105&eltype=40&eltid=808
    // http://www.countrywatch.com/elections/profile?countryid=142&eltype=41&eltid=756
    result.rtype = 'REPORT';
    result.mime = 'HTML';
    result.title_id = param.countryid;
    result.unitid = `countryid=${param.countryid}&eltype=${param.eltype}&eltid=${param.eltid}`;
  }
  return result;
});
