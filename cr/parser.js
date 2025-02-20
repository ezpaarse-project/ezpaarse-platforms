#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Campus Review
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

  if (param.s != undefined) {
    // https://www.campusreview.com.au/?s=ai
    // https://www.campusreview.com.au/?s=budget
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/campus-review-vol-([0-9]+)-issue-([0-9]+)-([a-zA-Z0-9-]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://viewer.joomag.com/campus-review-vol-33-issue-01-january-february-2023/0126551001675131579?short&
    // https://viewer.joomag.com/campus-review-vol-31-issue-05-may-2021/0735470001620967163?short&
    // https://viewer.joomag.com/campus-review-vol-30-issue-12-dec-2020/0365267001606972437?short&
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.publication_date = match[3];
    result.issue            = match[2];
    result.vol              = match[1];
    result.unitid           = match[4];

  } else if (/^\/[0-9]+\/[0-9]+\/emag-archive\/?$/i.exec(path)) {
    // https://www-campusreview-com-au.libraryproxy.griffith.edu.au/2017/03/emag-archive/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/([0-9]{4})\/([0-9]{2})\/hedx-podcast-([a-zA-Z0-9-]+)-episode-([0-9]+)\/?$/i.exec(path)) !== null) {
    // https://www.campusreview.com.au/2025/01/hedx-podcast-professor-genevieve-bell-on-ai-episode-151/
    // https://www.campusreview.com.au/2024/11/hedx-podcast-what-does-an-ai-first-uni-look-like-episode-145/
    result.rtype    = 'AUDIO';
    result.mime     = 'MP3';
    result.title_id         = match[3];
    result.publication_date = `${match[1]}/${match[2]}`;
    result.unitid           = `${match[1]}/${match[2]}/hedx-podcast-${match[3]}-episode-${match[4]}`;

  } else if ((match = /^\/([0-9]{4})\/([0-9]{2})\/([a-zA-Z0-9-]+)\/?$/i.exec(path)) !== null) {
    // https://www.campusreview.com.au/2024/12/tesla-chair-to-lead-research-and-development-review/
    // https://www.campusreview.com.au/2018/02/student-housing-the-bad-the-worse-and-the-roach-infested/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id         = match[3];
    result.publication_date = `${match[1]}/${match[2]}`;
    result.unitid           = `${match[1]}/${match[2]}/${match[3]}`;

  }

  return result;
});
