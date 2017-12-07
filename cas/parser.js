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

  // use console.error for debuging
  console.error(parsedUrl);

  let match;

  if (/^\/scifinder\/searches$/i.test(path)) {
    // https://scifinder.cas.org:443/scifinder/searches?type=topic
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/scifinder\/analyze\/summary$/i.test(path)) {
    // https://scifinder.cas.org:443/scifinder/analyze/summary?analysisType=AUTHOR_INVENTOR_NO_GROUPING&params=eNpb85aBtYSB0zGvuDy1KDi1pIRBxcjcycTEycAkwsLMzdjUwNI4wsTY0snQyMjZyNTYxdLAycTZEgC76g5k
    result.rtype    = 'ANALYSIS';
    result.mime     = 'MISC';
  } else if ((match = /^\/scifinder\/references\/(.*)\/fulltext$/.exec(path)) !== null) {
    // https://scifinder.cas.org:443/scifinder/references/CAPLUS_2017:1899309/fulltext?nav=eNpb85aBtYSBMbGEQcXI3MnExMnAJMLCzM3Y1MDSOMLE2NLJ0MjI2cjU2MXSwMnE2RKoNKm4iEEwK7EsUS8nMS9dzzOvJDU9tUjo0YIl3xvbLZgYGD0ZWMsSc0pTK4oYBBDq_Epzk1KL2tZMleWe8qCbiYGhooCBgYEZaGBGCYO0Y2iIh39QvKdfmKtfCJDh5x_vHuQfGuDp517CwJmZW5BfVAI0obiQoY6BGaiPASianVsQlFqIIgoAGac7Hw
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/help\/scifinder\/R42\/sciplanner\/(.*).htm$/i.exec(path)) !== null) {
    // https://scifinder.cas.org:443/help/scifinder/R42/sciplanner/video_manipulate_workspace_objects.htm
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
