#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform chicago scholarship online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);
  var match;
  if ((match = /^\/[a-z]+\/([0-9]+\.[0-9]+\/[a-z]+\/([0-9]+))\.[0-9]+\.[0-9]+\/([a-z]+\-([0-9]+))$/.exec(path)) !== null) {
    //view/10.7208/chicago/9780226243276.001.0001/upso-9780226243238
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.doi = match[1];
    result.unitid   = match[3];
    result.print_identifier = match[4];
    result.online_identifier = match[2];
  }
  else if ((match = /^\/[a-z]+\/([0-9]+\.[0-9]+\/[a-z]+\/([0-9]+))\.[0-9]+\.[0-9]+\/([a-z]+\-([0-9]+)\-[a-z]+\-[0-9]+)$/.exec(path)) !==null) {
  //http://chicago.universitypressscholarship.com/view/10.7208/chicago/9780226243276.001.0001/upso-9780226243238-chapter-1
  //http://chicago.universitypressscholarship.com/view/10.7208/chicago/9780226243276.001.0001/upso-9780226243238-chapter-1?print=pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    if (param.print && param.print == 'pdf')
    {
      result.rtype   = 'BOOK';
      result.mime    = 'PDF';
    }
    result.doi = match[1];
    result.unitid   = match[3];
    result.print_identifier = match[4];
    result.online_identifier = match[2];
  }

  else if ((match = /^\/[a-z]+$/.exec(path)) !==null)
  {
    //browse?t=OSO:history
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (param.t)
    {
      result.unitid = param.t;
    }
  }

  return result ;
});