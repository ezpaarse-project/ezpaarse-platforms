#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform East View
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
 //console.error(parsedUrl);

  let match;

  if ((match = /^\/browse\/book\/reader\/(([0-9]+)\/book.+)$/i.exec(path)) !== null) {
    //https://dlib.eastview.com/browse/book/reader/64626/book11_.swf?time=1483267719013
    //https://dlib.eastview.com/browse/book/reader/64626/book37_.swf?time=1483267719091
    //https://dlib.eastview.com/browse/book/reader/64626/book356_.swf?time=1483267720198	
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'MISC';
    result.title_id = match[2];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[1] + parsedUrl.search;

  } else if ((match = /^\/issue_images\/((.+)\/([0-9]+)\/(.+)\.jpg)$/i.exec(path)) !== null) {
    //https://dlib.eastview.com/issue_images/RUSEB2162959BO/1996/coverbig.jpg	
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
