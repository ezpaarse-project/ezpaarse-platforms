#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

function parseId (param, result) {
  let idPath = param.id.split('/');
  let id = idPath[idPath.length - 1];
  result.title_id = id;
  result.unitid = id;
}

/**
 * Recognizes the accesses to the platform Scholars Portal Books
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

  if (/^\/[a-z]+\/search$/i.test(path)) {
    // https://books.scholarsportal.info/en/search?q=rocks&l=ANY&ent=0&ia=false&s=relevance&c=all&page=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/api\/bits$/i.test(path)) {
    // https://books.scholarsportal.info/api/bits?id=/ebooks/ebooks2/springer/2011-04-28/1/1402022360
    result.rtype    = 'METADATA';
    result.mime     = 'XML';
    parseId(param, result);
  } else if (/^\/[a-z]+\/read$/i.test(path)) {
    // https://books.scholarsportal.info/en/read?id=/ebooks/ebooks2/springer/2011-04-28/1/1402022360
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    parseId(param, result);
  } else if ((match = /^\/uri\/ebooks\/[a-z0-9]+\/[a-z0-9]+\/[0-9-]+\/[0-9]+\/([0-9-_]+)$/i.exec(path)) !== null) {
    // https://books.scholarsportal.info/uri/ebooks/ebooks5/statcanada5/2020-07-21/14/82-509_1010013485
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/api\/pdf\/full\/(.*)$/i.exec(path)) !== null) {
    // https://books.scholarsportal.info/api/pdf/full/U2FsdGVkX19nFImPW4uY1RxH5TEvjK1tqjPeMKGAQUh%2F9ScR29muznzct6tSHnIsUlGUtHkc9JNCgf4CZXHayCYrS3%2B03zUPQUCckzqUHn3MNxEokzWBEf7QuULxHo9qtKKAPK5d73qpbJI544y2gg%3D%3D/0
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
