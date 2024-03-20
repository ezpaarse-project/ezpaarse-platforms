#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Policy Commons
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/search\/?$/i.test(path)) {
    // https://policycommons.net/search/?q=india+NEAR+agriculture&i=items
    // https://policycommons.net/search/?q=net-zero+AND+NOT+mathematics&i=items
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/artifacts\/([0-9]+)\/([a-zA-Z0-9-_]+)\/([0-9]+)\/?$/i.exec(path)) !== null) {
    // https://policycommons.net/artifacts/2100936/integration-governance-in-italy-accommodation-regeneration-and-exclusion/2856233/
    // https://policycommons.net/artifacts/2100924/refugee-accommodation-governance-in-sweden/2856221/
    // https://policycommons.net/artifacts/2095901/language-education-for-asylum-seekers-and-refugees-in-cyprus/2851199/
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.title_id = `${match[2]}`;
    result.unitid   = `${match[1]}/${match[2]}/${match[3]}/`;
  } else if ((match = /^\/artifacts\/([0-9]+)\/([a-zA-Z0-9-_]+)\/([0-9]+)\/fragments\/([0-9]+)\/?$/i.exec(path)) !== null) {
    // https://policycommons.net/artifacts/8330730/editorial/9261170/fragments/8052398/
    // https://policycommons.net/artifacts/8330730/editorial/9261170/fragments/8052405/
    // https://policycommons.net/artifacts/8225368/the-angkorian-hydraulic-system/9140911/fragments/4626005/
    result.rtype    = 'TABLE';
    result.mime     = 'HTML';
    result.unitid   = `${match[1]}/${match[2]}/${match[3]}/fragments/${match[4]}/`;
  } else if ((match = /^\/artifacts\/([0-9]+)\/([a-zA-Z0-9-_]+)\/view\/?$/i.exec(path)) !== null) {
    // https://policycommons-net/artifacts/11280511/theme_introduction/view/
    // https://policycommons.net/artifacts/9782146/egypt-through-the-looking-glass/view/
    // https://policycommons.net/artifacts/2389482/sigona2021_article_migrationinfrastructuresandthe/view/
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = `${match[2]}`;
    result.unitid   = `${match[1]}/${match[2]}`;
  }

  return result;
});
