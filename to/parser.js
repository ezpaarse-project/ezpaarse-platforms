#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Tirant Online
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

  if (/^\/base\/tolmex\/general\/searches$/i.test(path)) {
    // https://www.tirantonline.com.mx/base/tolmex/general/searches?token_id=660183225abeb300104d8979
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/base\/tolmex\/searches\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.tirantonline.com.mx/base/tolmex/searches/2136567
    // https://www.tirantonline.com.mx/base/tolmex/searches/2007009
    result.rtype    = 'PREVIEW';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/tolmex\/documento\/show\/([0-9]+)$/i.exec(path)) !== null && param.search_type !== undefined) {
    // https://www.tirantonline.com.mx/tolmex/documento/show/2007009?search_type=jurisprudencia
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = param.search_type;
    result.unitid   = `${match[1]}?search_type=${param.search_type}`;
  } else if ((match = /^\/tolmex\/documento\/show\/([0-9]+)$/i.exec(path)) !== null && parsedUrl.hash !== undefined) {
    // https://www.tirantonline.com.mx/tolmex/documento/show/256779#36190
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = `${match[1]}${parsedUrl.hash}`;
  } else if ((match = /^\/cloudLibrary\/ebook\/show\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.tirantonline.com.mx/cloudLibrary/ebook/show/9788410563131
    // https://www.tirantonline.com.mx/cloudLibrary/ebook/show/9788411694261
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.print_identifier   = match[1];
    result.unitid             = match[1];
  } else if ((match = /^\/tol\/documento\/show\/([0-9]+)$/i.exec(path)) !== null && param.librodoctrina !== undefined) {
    // https://www.tirantonline.com/tol/documento/show/9526977?librodoctrina=19485&general=Tribunales
    // https://www.tirantonline.com/tol/documento/show/5643807?librodoctrina=11445&general=Tribunales
    result.rtype    = 'CODE_JURIDIQUE';
    result.mime     = 'HTML';
    result.unitid   = `${match[1]}?librodoctrina=${param.librodoctrina}`;
  } else if ((match = /^\/tol\/documento\/show\/([0-9]+)$/i.exec(path)) !== null && param.materia !== undefined) {
    // https://www.tirantonline.com/tol/documento/show/3000518?materia=
    // https://www.tirantonline.com/tol/documento/show/8268004?materia=
    result.rtype    = 'FIGURE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if ((match = /^\/tol\/documento\/show\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.tirantonline.com/tol/documento/show/214466
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/base\/tol\/formularios\/searches\/navigate$/i.exec(path)) !== null && param.token_id !== null && param.docid != null) {
    // https://www.tirantonline.com/base/tol/formularios/searches/navigate?token_id=6601b28a64543600155f9721&index=1&docid=9317574
    // https://www.tirantonline.com/base/tol/formularios/searches/navigate?token_id=6601b38a64543600155f9772&index=0&docid=1042608
    result.rtype    = 'FORMULES';
    result.mime     = 'HTML';
    result.db_id    = param.docid;
    result.unitid   = param.token_id;
  }

  return result;
});
