#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Netter Reference
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

  if ((/^\/content\/[a-z0-9_]+\/index\.php$/i.test(path)) && param.task == 'search') {
    // https://netterreference.com/content/netter_atlas_7e/index.php?task=search&searchstring=Bone
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((/^\/ELSEVIER\/a\/advancesearch-action\/search\/(.+)$/i.test(path))) {
    // https://netterreference.com/ELSEVIER/a/advancesearch-action/search/0/0/x
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((/^\/ELSEVIER\/[a-z0-9_]+\/(.+)$/i.test(path))) {
    // https://netterreference.com/ELSEVIER/hansen__netter_s_clinical_anatomy_3rd_edition/b/medialibrary/imagetoc/34
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
  }

  return result;
});
