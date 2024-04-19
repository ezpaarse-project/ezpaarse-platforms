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
  let match;
  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/reports$/i.test(path)) {
    // https://emory-policymap-com.proxy.library.emory.edu/reports?type=b&area=predefined&pid=679464
    if (param.pid) {
      result.rtype   = 'RECORD_VIEW';
      result.mime    = 'HTML';
      result.unitid  = param.pid;
    }
  } else if (/^\/d\/$/i.test(path)) {
    // https://emory.policymap.com:443/d/?ty=data&t=tc&servlet=boundary%2Fget%2F&sty=pid&i=2963976&ars=1&sid=3453&trackingCode=fe5febdc41fbe139e80b2d9bcfa08eeb1513200481836&c=jQuery21409675907150244545_1513200411848&_=1513200411862
    if (param.i) {
      result.rtype   = 'RECORD_VIEW';
      result.mime    = 'HTML';
      result.unitid  = param.i;
    } else if (param.pid) {
      result.rtype   = 'RECORD_VIEW';
      result.mime    = 'HTML';
      result.unitid  = param.pid;
    }
  }  else if (/^\/newmaps#?\/?$/i.test(path)) {
    // https://uc.policymap.com/newmaps#/
    result.rtype   = 'MAP';
    result.mime    = 'HTML';
  } else if ((match = /^\/blog\/([a-zA-Z0-9-]+)\/?$/i.exec(path)) !== null) {
    // https://uc.policymap.com/blog/limited-supermarket-access-data
    // https://uc.policymap.com/blog/investing-in-communities-understanding-trends-and-needs
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/resources\/customer-stories\/([a-zA-Z0-9-]+)\/?$/i.exec(path)) !== null) {
    // https://uc.policymap.com/resources/customer-stories/life-lines-throughout-the-us
    // https://uc.policymap.com/resources/customer-stories/apple-tree-dental
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
