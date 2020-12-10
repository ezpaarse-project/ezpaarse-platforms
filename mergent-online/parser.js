#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Mergent Online
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

  if ((match = /^\/(companyfinancials)\.php$/i.exec(path)) !== null) {
    // https://www.mergentonline.com:443/companyfinancials.php?compnumber=46032&isexcel=1
    result.title_id = match[1];
    result.unitid  = param.compnumber;
    if (param.isexcel) {
      result.rtype   = 'DATASET';
      result.mime    = 'XLS';
    } else {
      result.rtype   = 'ARTICLE';
      result.mime    = 'MISC';
    }

  } else if ((match = /^\/(companyannualreports|companydetail|companyownership|equitypricing)\.php$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    // https://www.mergentonline.com:443/companyannualreports.php?compnumber=46032
    // https://www.mergentonline.com:443/equitypricing.php?compnumber=12780
    // https://www.mergentonline.com:443/companyannualreports.php?reportnumber=2160793&compnumber=46032&pagetype=annualreport&getreport=1
    if (!param.isexcel) {
      result.rtype    = 'ARTICLE';
      result.mime     = 'MISC';
      result.title_id =  match[1];
      /**
      * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
      * it described the most fine-grained of what's being accessed by the user
      * it can be a DOI, an internal identifier or a part of the accessed URL
      * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
      */
      result.unitid = param.compnumber || param.companyName;
    }

  }

  return result;
});
