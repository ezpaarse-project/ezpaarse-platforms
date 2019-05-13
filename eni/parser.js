#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bibliothèque Numérique ENI
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  /* eslint-disable-next-line */
  let match;

  if ((match = /^\/([a-z_]+)\/mediabook.aspx$/i.exec(path)) !== null) {
    if (param.idp) result.title_id = param.idp;
    if (param.ida) result.unitid = param.ida;
    if (param.idR || param.idR) result.unitid = param.idR || param.idr;

    result.rtype = 'BOOK_SECTION';
    result.mime  = 'HTML';
  } else if ((match = /^\/([a-z_]+)\/video.aspx$/i.exec(path)) !== null) {
    if (param.idR || param.idr) {
      result.unitid = param.idR || param.idr;
    }

    result.rtype = 'TOC';
    result.mime  = 'MISC';
  } else if ((match = /^\/([a-z_]+)\/get_Resource.aspx$/i.exec(path)) !== null) {
    result.rtype = 'BOOK_SECTION';
    result.mime  = 'HTML';
  } else if ((match = /^\/([a-z_]+)\/get_PlayList.aspx$/i.exec(path)) !== null) {
    if (param.idM || param.idm) {
      result.unitid = param.idM || param.idm;
    }
    result.rtype = 'VIDEO';
    result.mime  = 'MISC';
  } else if ((match = /^\/([a-z_]+)\/pdfexport.aspx$/i.exec(path)) !== null) {
    result.rtype = 'BOOK_SECTION';
    result.mime  = 'PDF';
  }

  return result;
});

