#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Korean Social Science Data Center
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

  if ((match = /^\/attach\/rpp\/rpp_([0-9]+).pdf$/i.exec(path)) !== null) {
    // https://ksdcdb.kr/attach/rpp/rpp_2831.pdf
    // https://ksdcdb.kr/attach/rpp/rpp_2834.pdf
    result.rtype    = 'DATASET';
    result.mime     = 'PDF';
    result.unitid = `rpp_${match[1]}`;

  } else if (/^\/sbs\/stat\/Descript.jsp$/i.test(path) && param.fileN !== undefined) {
    // https://www.ksdcdb.kr/sbs/stat/Descript.jsp?statT=1&analT=1&fileN=data_120240507223334.csv
    // https://www.ksdcdb.kr/sbs/stat/Descript.jsp?statT=1&analT=1&fileN=data_9920240507222915.csv
    result.rtype    = 'ANALYSIS';
    result.mime     = 'CSV';
    result.unitid   = param.fileN.split('.csv')[0];

  } else if (/^\/data\/dataSearchResPollPopup.do$/i.test(path)) {
    // https://ksdcdb.kr/data/dataSearchResPollPopup.do
    result.rtype    = 'EXERCISE';
    result.mime     = 'HTML';

  } else if ((match = /^\/attach\/cbook\/cbook_([0-9]+).pdf$/i.exec(path)) !== null) {
    // https://ksdcdb.kr/attach/cbook/cbook_2840.pdf
    // https://ksdcdb.kr/attach/cbook/cbook_2832.pdf
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.unitid   = `cbook_${match[1]}`;

  } else if (/^\/data\/dataSearchResView.do$/i.test(path) && param.surveyId !== undefined) {
    // https://ksdcdb.kr/data/dataSearchResView.do?surveyId=2840
    // https://ksdcdb.kr/data/dataSearchResView.do?surveyId=2832
    result.rtype    = 'DATASET';
    result.mime     = 'HTML';
    result.unitid   = param.surveyId;

  } else if (/^\/data\/dataSearchRes.do$/i.test(path)) {
    // https://ksdcdb.kr/data/dataSearchRes.do
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  }

  return result;
});
