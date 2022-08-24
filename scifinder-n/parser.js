#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Scifinder-n
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/patent-viewer$/i.exec(path)) !== null) {
    // /patent-viewer?docuri=GJoLFx0bLO-a_GyaL7MHTYpl8aazAECgsmSPAZOPIV0&markedFullTextKey=SYeWXFqEw3zJf9Qbd6ptMHTr_8tHXOoyQjKpgh0wLQw.pdf&fullTextKey=foF0RdkcUQqkpVPmwhRpTRBi3P6KtQhu81hFT4UP8-w.pdf
    result.rtype = 'FULL_TEXT_USE';
    result.mime = 'HTML';
    
    if (typeof param.fullTextKey === 'string') {
      result.unitid = param.fullTextKey.split('.')[0];
    }

  } else if ((match = /^\/pdf\/v1\/[a-z0-9_-]+\/[a-z0-9_-]+\/([a-z0-9_-]+)\.pdf$/i.exec(path)) !== null) {
    // /pdf/v1/AUTH_5060d187888f42fe97a1589aed05c6d6/full-patentpak-fulltext-12/foF0RdkcUQqkpVPmwhRpTRBi3P6KtQhu81hFT4UP8-w.pdf?temp_url_sig=b252dd9d88dd837f400562fe75371eb23d310aa0&temp_url_expires=1656076506&inline
    result.rtype = 'FULL_TEXT_USE';
    result.mime = 'PDF';
    result.unitid = match[1];

  } else if (/^\/internal\/api\/scifinderResults\/[a-z0-9]+$/i.test(path)) {
    // /internal/api/scifinderResults/62b5b461fa1d3a0f6a21fdb5?appId=097720d0-3c41-4af0-9904-9d4c35b64dbd&cidValue=713&contentUri=document/pt/document/27836197&metricsOrdinal=1&metricsResultType=reference&sortBy=relevance&sortOrder=descending&sourceInitiatingActionId=d99f8f50-5e5e-4cc6-94d4-b36c010504a4&uiContext=364&uiSubContext=551&responseStreaming=true
    // /internal/api/scifinderResults/6299afa6f076050e6ef1a8ba?responseStreaming=true&shouldReturnFacets=true&appId=40bcdee2-6543-40ce-8a3d-d993b69a5c68&sortBy=relevance&sortOrder=descending&sourceInitiatingActionId=d0550868-8ffc-4482-a23a-632d43c03078&uiContext=375&uiSubContext=359

    result.rtype = 'SEARCH';
    result.mime = 'HTML';

    if (param.contentUri) {
      result.rtype = 'RECORD_VIEW';
      result.unitid = param.contentUri;
    }
  }



  return result;
});
