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
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/home\/search$/i.test(path)) {
    // /home/search?q=Trump
    // /home/search?q=Biden
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if (/^\/intelligence\/countrywirestory$/i.test(path)) {
    // /intelligence/countrywirestory?uid=7083883
    // /intelligence/countrywirestory?uid=7083882

    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = param.uid;

  } else if ((match = /^\/intelligence\/mapsglobal$/i.exec(path)) != null) {
    // /intelligence/mapsglobal?globalsectionid=3&imageid=1

    result.rtype = 'MAP';
    result.mime = 'HTML';
    result.unitid = `globalsectionid=${param.globalsectionid}&imageid=${param.imageid}`;

  } else if ((match = /^\/intelligence\/mapsdisplay$/i.exec(path)) != null) {
    // /intelligence/mapsdisplay?sectionid=1&catgoryid=1&subcategoryid=1&submenuid=1
    // /intelligence/mapsdisplay?sectionid=2&catgoryid=4
    // /intelligence/mapsdisplay?sectionid=1&catgoryid=6&subcategoryid=1&submenuid=1

    result.rtype = 'MAP';
    result.mime = 'HTML';
    result.unitid = `sectionid=${param.sectionid}&catgoryid=${param.catgoryid}`;

    if (param.subcategoryid) {
      result.unitid = `sectionid=${param.sectionid}&catgoryid=${param.catgoryid}&subcategoryid=${param.subcategoryid}&submenuid=${param.submenuid}`;
    }

  } else if ((match = /^\/home\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // /home/coronavirus?topic=sdcvd
    // /home/coronavirus?topic=sdcvs

    result.rtype = 'TABLE';
    result.mime = 'HTML';
    result.unitid = `${match[1]}?topic=${param.topic}`;

  } else if (/^\/elections\/profile$/i.test(path)) {
    // /elections/profile?countryid=105&eltype=40&eltid=808
    // /elections/profile?countryid=142&eltype=41&eltid=756

    result.rtype = 'REPORT';
    result.mime = 'HTML';
    result.title_id = param.countryid;
    result.unitid = `countryid=${param.countryid}&eltype=${param.eltype}&eltid=${param.eltid}`;
  }
  return result;
});
