#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform SciFinder / Chemical Abstracts
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

  if (/^\/scifinder\/searches$/i.test(path)) {
    // https://scifinder.cas.org:443/scifinder/searches?type=topic
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/scifinder\/references\/((.*?):(.*))\/fulltext$/i.exec(path)) !== null) {
    // https://scifinder.cas.org:443/scifinder/references/CAPLUS_2017:1899309/fulltext?nav=eNpb85aBtYSBMbGEQcXI3MnExMnAJMLCzM3Y1MDSOMLE2NLJ0MjI2cjU2MXSwMnE2RKoNKm4iEEwK7EsUS8nMS9dzzOvJDU9tUjo0YIl3xvbLZgYGD0ZWMsSc0pTK4oYBBDq_Epzk1KL2tZMleWe8qCbiYGhooCBgYEZaGBGCYO0Y2iIh39QvKdfmKtfCJDh5x_vHuQfGuDp517CwJmZW5BfVAI0obiQoY6BGaiPASianVsQlFqIIgoAGac7Hw
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[3];
  } else if ((match = /\/scifinder\/R42\/sciplanner\/(.*).htm$/i.exec(path)) !== null) {
    // https://scifinder.cas.org:443/help/scifinder/R42/sciplanner/video_manipulate_workspace_objects.htm
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/scifinder\/analyze\/summary$/i.test(path)) {
    // https://scifinder.cas.org:443/scifinder/analyze/summary?analysisType=AUTHOR_INVENTOR_NO_GROUPING&params=eNpb85aBtYSB0zGvuDy1KDi1pIRBxcTczM3YyM01wgJImxqYu0QYORs5WzhZmpmYuRpZGJmYmboBAMH7DqE
    result.rtype    = 'ANALYSIS';
    result.mime     = 'HTML';
  } else if (/^\/scifinder\/substancesImage\/structure\//i.test(path)) {
    // https://scifinder.cas.org:443/scifinder/substancesImage/structure/AjU8gQ_b8V62mSUUKQflpbWMytVNJ3_hLowMYw8bCjrMjXEWqX0Edd0rWjkhsPzjtLVHhOuAmx0qA3keLsc_7BU1BrhqsOPaSmqW_4uuk30CBdJ0z_wBnpjxBwsmbf_Umuij7R2wmlJvBnHegU99gg?imageMaxWidth=2000&scale=0.03&isReactionImage=false
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
  } else if (/^\/scifinder\/substances\/answers\/.*.html$/i.test(path)) {
    // https://scifinder.cas.org:443/scifinder/substances/answers/27A3CCCEX86F35094X3341EB425496620440:27F22503X86F35093X7774DEFC1439F415B9/1.html?key=REGISTRY_1328895-95-9&title=1328895-95-9&launchSrc=sublist&pageNum=1&nav=eNpb85aBtYSBMbGEQcXI3M3IyNTAOMLCzM3Y1MDSOMLc3NzExdXN2dDE2NLNxNDUyRKoNKm4iEEwK7EsUS8nMS9dzzOvJDU9tUjo0YIl3xvbLZgYGD0ZWMsSc0pTK4oYBBDq_Epzk1KL2tZMleWe8qCbiYGhooCBgUEcaGBGCQN3cGiAa1B8kL-PazBQJL-4kKGOgRkoz1jCwFRUhmqjU35-Tmpi3lmFooarc369A9oYBbOxgAEAg04-rQ&sortKey=SUBSTANCE_ID&sortOrder=DESCENDING
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = param.title;
    result.unitid   = param.title;
  } else if (/^\/scifinder\/dynamicImage\/display\/PNG\//i.test(path)) {
    // https://scifinder.cas.org:443/scifinder/dynamicImage/display/PNG/IIKeyS:eNpb85aBtYSBMbGEQcXE1MLCyMjCNMLCzM3Y1MDJIMLUxdLQ0tLN0djA0MXcwNLQ2QmoNKm4iEEwK7EsUS8nMS9dzzOvJDU9tUjo0YIl3xvbLZgYGD0ZWMsSc0pTK4oYBBDq_Epzk1KL2tZMleWe8qCbiYGhooCBgYEZaGBGCYO0Y2iIh39QvKdfmKtfCJDh5x_vHuQfGuDp517CwJmZW5BfVAI0obiQoY6BGaiPASianVsQlFqIIgoAIl87LQkey:a9343374931f3081b41365640d49b0ff46389985aeb49a2e50c9c147433150e1.dyngif
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
  }

  return result;
});
