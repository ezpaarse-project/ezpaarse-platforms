#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Global Financial Data
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

  if ((match = /^\/AutoTrac\/Download$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    // https://finaeon.globalfinancialdata.com:443/AutoTrac/Download?file=Jonathan_Eaton_Download_11_6_2020_6_24_15_AM55_csv.csv
    result.rtype    = 'DATASET';
    result.mime     = 'CSV';

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */

    /** LBS comment:
    * if we write 'result.unitid = param.file;' then by default
    * we return entire value including user's GFD login name...
    * So we must redact file= param value to extract only the downloaded file(s)
    * result.unitid = param.file; // don't use this!
    */

    // --- PRIVACY REDACTION FOR CSV DOWNLOADS ---
    // --- RETURN FILENAME ONLY  ---
    var fileRegex   = /(Download_.*_csv.csv)/;
    var file        = param.file.match(fileRegex);
    result.unitid   = file[0];
    // uncomment next line for debug under local 'make test gfd' only
    // to check our matched result.unitid against our 'out.unitid' values in
    // gfd/test csv data
    //console.warn(result.unitid);

  } else if ((match = /^\/AutoTrac\/DownloadWorkBook2$/i.exec(path)) !== null) {
    //Excel 2007 or 2003 downloads don't get a specific filename unlike CSVs -
    //only a generic action
    //https://finaeon.globalfinancialdata.com:443/AutoTrac/DownloadWorkbook2?Length=8
    result.rtype    = 'DATASET';
    result.mime     = 'XLS';
    //result.title_id = match[1];
    result.unitid   = 'Excel-Download';  // custom return value because generic
  }
  return result;
});
