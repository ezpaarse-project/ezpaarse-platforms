#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme HeinOnline
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/HOL\/(Page|PageMulti|Print|Contents)$/i.exec(path)) !== null) {
    if (match[1].toLowerCase() === 'contents') {
      // /HOL/Contents?handle=hein.journals/antil77&id=1&size=2&index=&collection=journals
      result.rtype = 'TOC';
      result.mime  = 'HTML';
    } else {
      // /HOL/Page?handle=hein.journals/antil77&id=53
      // /HOL/PageMulti?collection=journals&number_of_pages=4&handle=hein.journals/antil77&id=53
      // /HOL/Print?collection=journals&handle=hein.journals/antil77&id=53
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
    }

    if (param.handle) {
      result.unitid = `${param.handle}/${param.id}` ;

      const titleIdMatch = /^[a-z0-9._-]+\/([a-z]+)[0-9]*$/i.exec(param.handle);
      if (titleIdMatch) {
        result.title_id = titleIdMatch[1];
      }
      if (param.number_of_pages) {
        result.unitid += `/${param.number_of_pages}`;
      }
    }
  } else if (/^\/HOL\/Index$/i.test(path)) {
    // /HOL/Index?index=journals/antil&collection=usjournals
    result.rtype = 'TOC';
    result.mime  = 'HTML';

    if (param.index) {
      const titleIdMatch = /^[a-z0-9._-]+\/([a-z]+)[0-9]*$/i.exec(param.index);
      if (titleIdMatch) {
        result.title_id = titleIdMatch[1];
      }
      result.unitid = param.index;
    }
  }

  return result;
});

