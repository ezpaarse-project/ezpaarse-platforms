#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Orbis
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if ((match = /^\/version-[0-9-]+\/(?:orbis|Orbis4Europe)\/[0-9]+\/(?:Companies|Research)\/Search$/i.exec(path)) !== null) {
    // https://orbis.bvdinfo.com/version-20201210/orbis/1/Companies/Search
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/version-[0-9-]+\/(?:orbis|Orbis4Europe)\/([0-9]+)\/(?:Companies|Research)\/List$/i.test(path)) {
    // https://orbiseurope.bvdinfo.com/version-20240919-5-2/Orbis4Europe/1/Companies/List
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/version-[0-9-]+\/(?:orbis|Orbis4Europe)\/([0-9]+)\/(?:Companies|Research)\/Report$/i.exec(path)) !== null) {
    // https://orbis.bvdinfo.com/version-20201210/orbis/1/Companies/Report
    result.rtype  = 'BOOK';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/version-[0-9-]+\/(?:orbis|Orbis4Europe)\/([0-9]+)\/(?:Companies|Research)\/Report\/seq\/([0-9]+)$/i.exec(path)) !== null) {
    // https://orbis.bvdinfo.com/version-20250619-4-0/Orbis/1/Companies/Report/seq/0?sl=1759852363156
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/version-[0-9-]+\/(?:orbis|Orbis4Europe)\/([0-9]+)\/(?:Companies|Research)\/report\/Index$/i.exec(path)) !== null) {
    // https://orbis.bvdinfo.com/version-20201210/orbis/1/Companies/report/Index?format=_standard&BookSection=TOC&seq=0
    // https://orbis.bvdinfo.com/version-20201210/orbis/1/Companies/report/Index?format=_standard&BookSection=PROFILE&seq=0
    result.rtype  = param.BookSection === 'TOC' ? 'TOC' : 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.unitid = param.BookSection === 'TOC' ? match[1] : `${match[1]}-${param.BookSection}`;
  }

  return result;
});
