#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform RIPM Jazz Periodicals
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  // let match;

  if (/^\/ripmjazz\/(browse|search).php$/i.test(path)) {
    // https://jazz.ripmfulltext.org:443/ripmjazz/search.php?Search=basic&mode=0&rpage=1&myZoom=&output=chronological&Illustrations=False&Musicexamples=False&RecordingList=False&minYEAR=1914&maxYEAR=2006&wildcard=0&LangSearchoption=&GuideBoolValue=0&NearBoolValue=1&SearchPreference=0&SimpTerms=saxophone&Submit=
    // https://jazz.ripmfulltext.org:443/ripmjazz/browse.php
    // https://jazz.ripmfulltext.org:443/ripmjazz/browse.php?changed=journalID&journalID=BAJ
    // https://jazz.ripmfulltext.org:443/ripmjazz/browse.php?changed=Year&journalID=GDD&Year=1948&volumeID=41
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/ripmjazz\/display.php$/i.test(path)) {
    // https://jazz.ripmfulltext.org:443/ripmjazz/display.php?journalID=&issueID=1385&volumeID=231&minYEAR=&maxYEAR=&ll=53&Search=basic&mode=0&rpage=1&myZoom=&output=chronological&Illustrations=False&Musicexamples=False&RecordingList=False&wildcard=0&LangSearchoption=&GuideBoolValue=0&NearBoolValue=1&SearchPreference=0&SimpTerms=saxophone&Submit=
    // https://jazz.ripmfulltext.org:443/ripmjazz/display.php?mode=1&journalID=BAJ&volumeID=346&issueID=2927&Year=1977
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.unitid   = param.volumeID + '/' + param.issueID;
  }

  return result;
});
