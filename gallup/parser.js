#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Gallup Analytics
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

  // let match;

  if (/^\/Charts/i.test(path)) {
    // https://analyticscampus.gallup.com:443/Charts
    result.rtype = 'GRAPH';
    result.mime  = 'HTML';
  } else if (/^\/Tables/i.test(path)) {
    // https://analyticscampus.gallup.com:443/Tables/ 
    result.rtype = 'TABLE';
    result.mime  = 'HTML';
  } else if (/^\/Explore/i.test(path)) {
    // https://analyticscampus.gallup.com:443/Explore
    result.rtype = 'MAP';
    result.mime  = 'HTML';
  } else if (/^\/Profiles/i.test(path)) {
    // https://analyticscampus.gallup.com:443/Profiles
    result.rtype = 'REF';
    result.mime  = 'HTML';
  } else if (/^\/Data\/GetArticleData$/i.test(path)) {
    // https://analyticscampus.gallup.com:443/Data/GetArticleData?itemId=257612
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.unitid = param.itemId;
    result.title_id = param.itemId;
  } else if (/^\/Data\/GetMapRankData$/i.test(path)) {
    // https://analyticscampus.gallup.com:443/Data/GetMapRankData?questionId=130&regionId=32&demoId=67
    result.rtype = 'MAP';
    result.mime = 'HTML';
    result.unitid = param.questionId + '/' + param.regionId + '/' + param.demoId;
    result.title_id = param.questionId + '/' + param.regionId + '/' + param.demoId;
  } else if (/^\/Data\/GetProfileMetricData$/i.test(path)) {
    // https://analyticscampus.gallup.com:443/Data/GetProfileMetricData?questionId=347&geoId=&regionId=31
    result.rtype = 'DATA';
    result.mime = 'HTML';
    result.unitid = param.questionId + '/' + param.geoId + '/' + param.regionId;
    result.title_id = param.questionId + '/' + param.geoId + '/' + param.regionId;
  }

  return result;
});
