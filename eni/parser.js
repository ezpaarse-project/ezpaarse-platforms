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
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  let match;

  if ((match = /^\/([a-z_]+)\/([a-z_]+).aspx$/i.exec(path)) !== null) {
    if (param.idp) result.title_id = param.idp;
    if (param.ida) result.unitid = param.ida;
    if (param.idR || param.idr) result.unitid = param.idR || param.idr;
    if (param.idM || param.idm) result.unitid = param.idM || param.idm;

    switch (match[2]) {
      case 'mediabook':
      case 'get_Resource':
        result.rtype = 'BOOK_SECTION';
        result.mime = 'HTML';
        break;

      case 'video':
        result.rtype = 'TOC';
        result.mime = 'MISC';
        break;

      case 'get_PlayList':
        result.rtype = 'VIDEO';
        result.mime = 'MISC';
        break;

      case 'pdfexport':
        result.rtype = 'BOOK_SECTION';
        result.mime = 'PDF';
        break;
    }
  } else if (/^\/portal\/api\/Mediabook\/GetPage\/$/i.test(path)) {
    // /portal/api/Mediabook/GetPage/
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';

  } else if (/^\/portal\/api\/Video\/GetVideo\/$/i.test(path)) {
    // /portal/api/Video/GetVideo/
    result.rtype = 'VIDEO';
    result.mime = 'MISC';

  } else if (/^\/portal\/api\/Mediabook\/GetMediabook\/$/i.test(path)) {
    // //portal/api/Mediabook/GetMediabook/
    result.rtype = 'BOOK';
    result.mime = 'HTML';

  } else if (/^\/portal\/api\/Filter\/GetResults\/$/i.test(path)) {
    // /portal/api/Filter/GetResults/
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  }



  return result;
});

