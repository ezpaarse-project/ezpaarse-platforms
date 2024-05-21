#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Revisti ESI
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
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/shflip\/([0-9]+)\/([0-9]+)\/[a-zA-Z0-9.\-_]+\/[0-9]+\/[0-9]+\/[0-9]+\/[0-9]+\/[0-9.]+\/[a-zA-Z0-9.]+\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.esidigita.it/shflip/115/9923170000/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxNzE1Mjg2OTk2LCJuYmYiOjEzNTcwMDAwMDAsImV4cCI6MTcxNTI4NzExNiwiZGF0YSI6IntcImlkXCI6XCIxMTVcIixcInNrdVwiOlwiOTkyMzE3MDAwMFwifSJ9.MJFBvKapf2VwFBRUt-9xUGxtxD3fKJP--_ugjq8xFJ0/0/270015/9923070000/9923170000/154.59.125.101/null/2023
    // https://www.esidigita.it/shflip/115/9923105000/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxNzE1Mjg0NzA0LCJuYmYiOjEzNTcwMDAwMDAsImV4cCI6MTcxNTI4NDgyNCwiZGF0YSI6IntcImlkXCI6XCIxMTVcIixcInNrdVwiOlwiOTkyMzEwNTAwMFwifSJ9.r5G6ZTYGW4cPRTRC7llmM9nk87-tFyHnBBWHLfnnmT8/0/270013/9923005000/9923105000/154.59.125.101/null/2023
    result.rtype    = 'ISSUE';
    result.mime     = 'PDF';
    result.unitid   = `${match[1]}/${match[2]}`;
    result.publication_date = match[3];

  } else if (/^\/shdash\/ip$/i.test(path)) {
    // https://www.esidigita.it/shdash/ip
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
