#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Pitchbook
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/profile\/([0-9-]+P?F?)\/(advisor|company|investor|person|fund|limited-partner)\/profile/i.exec(path)) !== null) {
    // https://my.pitchbook.com/profile/55545-67/advisor/profile
    // https://my.pitchbook.com/profile/89134-84/company/profile
    // https://my.pitchbook.com/profile/52158-25/investor/profile
    // https://my.pitchbook.com/profile/16995-16F/fund/profile
    // https://my.pitchbook.com/profile/35524-99P/person/profile#general-info
    // https://my.pitchbook.com/profile/10894-78/limited-partner/profile
    result.rtype = 'BIO';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2] + '/' + match[1];

  } else if ((match = /^\/search-results\/s[0-9]+\/([\w_]+)/i.exec(path)) !== null) {
    // https://my.pitchbook.com/search-results/s523491906/companies
    // https://my.pitchbook.com/search-results/s523492779/persons
    // https://my.pitchbook.com/search-results/s523493337/sp
    // https://my.pitchbook.com/search-results/s523493787/peer_group
    result.rtype = 'DATASET';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/website\/files\/pdf\/(\w+).pdf/i.exec(path)) !== null) {
    // https://files.pitchbook.com/website/files/pdf/Q1_2025_PitchBook_Analyst_Note_Navigating_the_Techbio_Investment_Ecosystem.pdf#page=1
    // https://files.pitchbook.com/website/files/pdf/Q1_2025_PitchBook_Analyst_Note_Navigating_the_Techbio_Investment_Ecosystem.pdf
    result.rtype = 'REPORT';
    result.mime = 'PDF';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/website\/files\/xls\/(\w+).xlsx?/i.exec(path)) !== null) {
    // https://files.pitchbook.com/website/files/xls/March_14_2025_Global_Distressed_Credit_Weekly_Wrap.xlsx
    // https://files.pitchbook.com/website/files/xls/March_14_2025_US_Leveraged_Loan_Defaults_List.xlsx
    result.rtype = 'DATASET';
    result.mime = 'XLS';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/website\/reports\/lcd\/([\w-_]+).zip/i.exec(path)) !== null) {
    // https://files.pitchbook.com/website/reports/lcd/March_14_2025_European_Flow-Name_Credit_Weekly_Snapshot_BPx.zip
    result.rtype = 'DATASET';
    result.mime = 'ZIP';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/research-center\/report\/([\w-]+)/i.exec(path)) !== null) {
    // https://my.pitchbook.com/research-center/report/4a09e356-e061-32b6-b637-f6bd0f8ec495
    // https://my.pitchbook.com/research-center/report/eb1a5041-a77d-3f48-81ca-8392e29c64cc
    result.rtype = 'REPORT';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/credit-analysis-news\/article\/(\d+)/i.exec(path)) !== null) {
    // https://my.pitchbook.com/credit-analysis-news/article/12528833
    // https://my.pitchbook.com/credit-analysis-news/article/12528818
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
  }

  return result;
});
