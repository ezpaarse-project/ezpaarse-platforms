#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform PolicyMap
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

  if (/^\/reports$/i.test(path)) {
    // https://emory-policymap-com.proxy.library.emory.edu/reports?type=b&area=predefined&pid=679464
    if (param.pid) {
      result.rtype   = 'REF';
      result.mime    = 'HTML';
      result.unitid  = param.pid;
    }
  } else if (/^\/d\/$/i.test(path)) {
    // https://emory.policymap.com:443/d/?ty=data&t=tc&servlet=boundary%2Fget%2F&sty=pid&i=2963976&ars=1&sid=3453&trackingCode=fe5febdc41fbe139e80b2d9bcfa08eeb1513200481836&c=jQuery21409675907150244545_1513200411848&_=1513200411862
    if (param.i) {
      result.rtype   = 'REF';
      result.mime    = 'HTML';
      result.unitid  = param.i;
    }
  }

  return result;
});
