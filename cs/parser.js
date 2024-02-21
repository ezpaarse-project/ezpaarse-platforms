#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Clinical Skills
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

  if ((match = /^\/skills\/([0-9]+\/quick-sheet)$/i.exec(path)) !== null) {
    // https://point.of.care.elsevierperformancemanager.com/skills/173/quick-sheet?skillId=EN_036
    // https://point.of.care.elsevierperformancemanager.com/skills/157/quick-sheet?skillId=EN_004
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = param.skillId;
    result.unitid = match[1] + '_' + param.skillId;

  } else if ((match = /^\/MNSImages\/([a-z0-9_]+\/[a-z0-9_]+)\.jpg$/i.exec(path)) !== null) {
    // https://mns.content.elsevierperformancemanager.com/MNSImages/EN_004/en_004_fig1_750_v6_00.jpg
    // https://mns.content.elsevierperformancemanager.com/MNSImages/EN_004/en_004_fig2_750_v7_00.jpg
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.unitid   = match[1];
  } else if ((match = /^\/[a-z0-9.]+\/([0-9]+\/[a-z0-9_]+\/[a-z]+_[0-9]+_([0-9]+))\.mp4$/i.exec(path)) !== null) {
    // https://mns.progressivecontent.elsevierperformancemanager.com/2.5DAnimation/20230315/ON_043_20230315/ON_043_20230315.mp4
    // https://mns.progressivecontent.elsevierperformancemanager.com/2.5DAnimation/20180420/EN_004_20180420/EN_004_20180420.mp4
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.publication_date = match[2];
    result.unitid   = match[1];
  } else if (/^\/(search|patienteducation)(\/content)?$/i.test(path)) {
    // https://point.of.care.elsevierperformancemanager.com/search?searchTerm=anesthesia%20alternatives&pageNumber=1&pageSize=25&requestStamp=1698267660579
    // https://point.of.care.elsevierperformancemanager.com/patienteducation/content?searchType=di&searchContext=peconditions&language=english&languageId=f79e9668-a1d1-4f8b-af0c-ce57f3f70036&searchTerm=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
