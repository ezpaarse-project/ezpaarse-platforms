#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const publisherName = {
  'statest.hiscant.univ-lorraine.fr': 'statest',
  'image.hiscant.univ-lorraine.fr': 'image',
  'ccj-corea.cnrs.fr': 'corea',
};

/**
 * Recognizes the accesses to the platform OMEKA
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

  result.publisher_name = publisherName[parsedUrl.host];

  if ((match = /^\/files\/original\/([0-9a-z]+)\.(jpg|pdf)$/i.exec(path)) !== null) {
    // /files/original/7f89e1ff3f55c4719445087d15f40b79.jpg
    result.rtype = 'IMAGE';
    result.mime = match[2] === 'pdf' ? 'PDF' : 'JPEG';
    result.unitid = match[1];
  } else if ((match = /^\/(ark:\/[0-9]+\/[a-z0-9]+)$/i.exec(path)) !== null) {
    // /ark%3A/67375/WLXWKr99tB1E
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.ark = match[1];
  } else if ((match = /^\/item\/([0-9]+)$/i.exec(path)) !== null) {
    // /item/190
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/items\/show\/([0-9]+)$/i.exec(path)) !== null) {
    // /items/show/2057
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if (/^\/solr-search$/i.test(path)) {
    // /solr-search?q=statue
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if (/^\/items\/browse$/i.test(path)) {
    // /items/browse
    result.rtype = !param.search ? 'TOC' : 'SEARCH';
    result.mime = 'HTML';
    if (param.collection) result.unitid = param.collection;
  } else if ((match = /^\/collections\/show\/([0-9]+)$/i.exec(path)) !== null) {
    // /items/browse
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  }

  return result;
});
