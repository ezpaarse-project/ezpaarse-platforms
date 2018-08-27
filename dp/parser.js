#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Data-Planet
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

  if (/^\/news$/i.test(path)) {
    // http://www.data-planet.com:80/news
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/\/data-available$|\/data-planet-data-hosting-services$|\/data-planet-statistical-datasets$|\/data-planet-statistical-ready-reference$|\/faq$|\/how-does-data-planet-compare$/i.test(path)) {
    // http://www.data-planet.com:80/data-available
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  } else if ((match = /^\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // http://www.data-planet.com:80/data-planet-reaches-52-billion-data-points
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/dataplanet\/Datasets.html$/i.test(path)) {
    // https://statisticaldatasets.data-planet.com:443/dataplanet/Datasets.html?id=c592841f-6d8e-4dab-b1e6-fae551d8b9ce&operatingMode=RR
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = param.id;
    result.unitid   = param.id;
  } else if (/^\/dataplanet\/datasheet\/Datasheet.jsp$/i.test(path)) {
    // https://statisticaldatasets.data-planet.com:443/dataplanet/datasheet/Datasheet.jsp?viewID=TREND%7COrg0t%7C%7CTimeUnit0%7C%7C%7C%7C%7Cfalse&sid=660ed6712dcdd%24188&param=7fuKsUAw6JIaGcWOIA3l-RqifedMlg0HY_uTQz4p8LO1D7vyDXzQi1AtR85-tjfzivbBl95C7yGtihBBWu16ws2ktUC9dRra3rq6A335S-JEYVQQ1DtiT7SJmR6BaT_fDVs7scW-EULiF6umwv5w9Bbei1E6qQlhlNU8cf1VyP7w27siS9MquJXYTf8JAZiVRYgkuvzRU1WFi7y5IkeQjw%3D%3D
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = param.sid;
    result.unitid   = param.sid;
  } else if (/^\/dataplanet\/DSH__Excel$/i.test(path)) {
    // https://statisticaldatasets.data-planet.com:443/dataplanet/DSH__Excel?sid=661d4cdbb95d5%24199
    result.rtype    = 'REF';
    result.mime     = 'MISC';
    result.title_id = param.sid;
    result.unitid   = param.sid;
  } else if (/^\/dataplanet\/DSH__Csv$/i.test(path)) {
    // http://statisticaldatasets.data-planet.com:80/dataplanet/DSH__Csv?sid=1c959da4aa4b9%2473
    result.rtype    = 'REF';
    result.mime     = 'MISC';
    result.title_id = param.sid;
    result.unitid   = param.sid;
  } else if (/^\/dataplanet\/DSH__Pdf$/i.test(path)) {
    // https://statisticaldatasets.data-planet.com:443/dataplanet/DSH__Pdf?sid=6a49deb304ff9%241c
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.title_id = param.sid;
    result.unitid   = param.sid;
  } else if (/^\/dataplanet\/DSH__DoiGen$/i.test(path)) {
    // https://statisticaldatasets.data-planet.com:443/dataplanet/DSH__DoiGen?type=doi&sid=6a6dbc61a458b$36&ses=46f39071-7a7f-4316-9e27-ecdd74f4f57d
    result.rtype    = 'REF';
    result.mime     = 'MISC';
    result.title_id = param.sid;
    result.unitid   = param.sid;
  } else if (/^\/srch_process_cs.php$/i.test(path)) {
    // http://data-planet.libguides.com:80/srch_process_cs.php?q=10.1016%2FS0140-6736(11)60887-8&action=580&search_source_id=0&layout=tab&start=0&group_id=0&guide_id=398600&f_group_id=&f_guide_type_id=&f_guide_owner_id=&f_guide_tag_ids=&f_guide_subject_ids=&sort=_score
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/ld.php$/i.test(path)) {
    // http://data-planet.libguides.com:80/ld.php?content_id=21684814
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.title_id = param.content_id;
    result.unitid   = param.content_id;
  }

  return result;
});
