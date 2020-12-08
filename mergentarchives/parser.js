#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Mergent Archives
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

  // use console.error for debugging
  // console.error(parsedUrl);

  if (/^\/viewReport\.php$/i.test(path) == true) {
    // ** Annual Reports ** //
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    // https://www.mergentarchives.com:443/viewReport.php?rtype=annualReports&documentID=224968&companyName=Raab%20Karcher%20AG%20%28Germany%2C%20Fed.%20Rep.%29&reportType=1&country=Germany
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.companyName;

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = param.documentID;

  } else if (/^\/modules\/corporateManuals\/displayPage\.php$/i.test(path) == true) {
    // ** Moody's Manuals ** //
    // https://www.mergentarchives.com:443/modules/corporateManuals/displayPage.php?manualID=2&year=2003&abbreviation=INDUSTRIAL&volume=1&pageNumber=1749&lastPageNumber=1751&companyName=Microsoft%20Corporation
    //
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.companyName;
    result.unitid   = param.abbreviation + '-MANUAL-' + param.year;
  }
  return result;
});
