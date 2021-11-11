#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const URL    = require('url');

function getUnitId(hash){
  const hashedUrl = URL.parse(hash, true);
  let hashMatch;
  let unitId;
  if ((hashMatch = /^\/([a-z-]+)\.mp4$/i.exec(hashedUrl.pathname)) !== null) {
    unitId = hashMatch[1];

  }else if ((hashMatch = /^\/[a-z]+\/[a-z]+\/(([0-9-]+).([0-9]+))\.mp4$/i.exec(hashedUrl.pathname)) !== null) {
    unitId = hashMatch[1];  
  }  
  return unitId
}

/**
 * Recognizes the accesses to the platform Jobs People Do
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

  if ((match = /^\/[0-9]{4}\/[0-9]{2}\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // http://jobspeopledo.com/2021/11/pandemic-passages-tackling-transitions/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if (/^\/job-videos\/$/i.test(path)) {
    // http://jobspeopledo.com/job-videos/#s3://jpd-videos/MCP-Butcher.mp4
    // ttp://jobspeopledo.com/job-videos/#https://cdn.careeronestop.org/OccVids/OccupationVideos/19-1031.00.mp4
    // http://jobspeopledo.com/job-videos/?What=rocks&x=0&y=0
    
    if (param.What !== undefined) {
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    } else {
      result.rtype    = 'VIDEO';
      result.mime     = 'HTML';
      result.unitid   = getUnitId(parsedUrl.hash.replace('#', ''));                  
    }
  }  

  return result;
});
