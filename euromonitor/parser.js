#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Euromonitor International
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

  if (/^\/portal\/policy\/accepttermsandconditions$/i.test(path)) {
    // http://www.portal.euromonitor.com:80/portal/policy/accepttermsandconditions?ControllerName=Default&ActionName=Index
    result.rtype    = 'CONNECTION';
    result.mime     = 'MISC';
  } else if (/^\/([A-z]+)\/main.js$/i.test(path)) {
    // http://www.portal.euromonitor.com:80/searchui/main.js?version=20180704_1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/portal\/dashboard\/analysisrelateddashboards$/i.test(path)) {
    // http://www.portal.euromonitor.com:80/portal/dashboard/analysisrelateddashboards?analysisId=437029&analysisTypeId=1&_=1556038899215
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.title_id = param.analysisId;
    result.unitid   = param._;
  } else if (/^\/portal\/analysis\/downloadpdf$/i.test(path)) {
    // http://www.portal.euromonitor.com:80/portal/analysis/downloadpdf?analysisId=462055&analysisTypeId=1&itemTypeId=48&elementId=0&elementTypeId=0&checksum=014264A2BDEE0CCDE0F27E9FBC42BAFD&searchString=TesT
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.title_id = param.analysisId;
    result.unitid   = param.analysisId;
  } else if (/^\/portal\/statisticsevolution\/exporttoolsasync$/i.test(path)) {
    // http://www.portal.euromonitor.com:80/portal/statisticsevolution/exporttoolsasync?measureTypeId=119&_=1556039200418
    result.rtype    = 'DATASET';
    result.mime     = 'HTML';
    result.unitid   = param._;
  }
  return result;
});
