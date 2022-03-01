#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Academic Writer
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

  if ((match = /^\/learn\/browse$/i.exec(path)) !== null) {
    // https://academicwriter.apa.org/learn/browse?group=All&view=list&term=abstract&sort=asc
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/learn\/browse\/((QG|TUT|SR|TBL|FIG)-([0-9])+)$/i.exec(path)) !== null) {
    // https://academicwriter.apa.org/learn/browse/QG-72?group=QG&view=list&sort=asc
    // https://academicwriter.apa.org/learn/browse/TUT-11?group=TUT&view=list&sort=asc
    // https://academicwriter.apa.org/learn/browse/SR-192?group=SR&view=list&sort=asc
    // https://academicwriter.apa.org/learn/browse/TBL-6?group=TBL&view=list&sort=asc
    // https://academicwriter.apa.org/learn/browse/FIG-1?group=FIG&view=list&sort=asc

    if (match[2] == 'QG' || match[2] == 'TUT') {
      result.rtype    = 'EXERCISE';
    } else if (match[2] == 'SR') {
      result.rtype    = 'REF';
    } else if (match[2] == 'TBL') {
      result.rtype    = 'TABLE';
    } else if (match[2] == 'FIG') {
      result.rtype    = 'FIGURE';
    }

    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
    result.db_id = match[2];
  } else if ((match = /^\/(reference|write)\/([a-z]+)(\/[a-z]+)?$/i.exec(path)) !== null) {
    // https://academicwriter.apa.org/reference/addReference/selectType
    // https://academicwriter.apa.org/reference/myReferences
    // https://academicwriter.apa.org/write/editorTemplate
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
  }

  return result;
});
