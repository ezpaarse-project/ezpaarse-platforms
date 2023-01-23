#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Drama Online
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

  if (/^\/playtext-detail$/i.test(path)) {
    // https://www.dramaonlinelibrary.com/playtext-detail?docid=do-9780571286355&tocid=do-9780571286355-div-00000003&actid=do-9780571286355-div-00000009
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid = param.docid.split('-')[1];
    result.online_identifier = param.docid.split('-')[1];

  } else if (/^\/playtext-overview$/i.test(path)) {
    // https://www.dramaonlinelibrary.com/playtext-overview?docid=do-9781350207936&tocid=do-9781350207936-div-10000004&st=Rent
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = param.docid.split('-')[1];
    result.online_identifier = param.docid.split('-')[1];
  } else if (/^\/audio$/i.test(path)) {
    // https://www.dramaonlinelibrary.com/audio?docid=do-9781527288676&tocid=do-9781527288676_6240388646001
    result.rtype    = 'AUDIO';
    result.mime     = 'HTML';
    result.unitid = param.docid.split('-')[1];
  } else if (/^\/video$/i.test(path)) {
    // https://www.dramaonlinelibrary.com/video?docid=do-9781350935129&tocid=do-9781350935129_6083699316001
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.unitid = param.docid.split('-')[1];
  } else if (/^\/search-results$/i.test(path)) {
    // https://www.dramaonlinelibrary.com/search-results?any=Rent
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
