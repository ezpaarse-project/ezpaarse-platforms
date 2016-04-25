#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Intelex Past Masters
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;
  var paramUnitID;
  if ((match = /^\/([a-z]+)\/([a-z\_]+)\/([a-z\_]+)\/([a-z0-9\_\.]+)\/([a-z0-9\_\.]+).pdf$/.exec(path)) !== null) {
    // http://pm.nlx.com/xtf/page_pdfs/beauvoir_fr/beauvoir_fr.06/beauvoir_fr.06_00001.pdf
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[5];
  } else if ((match = /^\/([a-z]+)\/view$/.exec(path)) !== null) {
    //http://pm.nlx.com/xtf/view?docId=freud_de/freud_de.04.xml;chunk.id=div.freud.
    //v4.33;toc.depth=1;toc.id=;brand=default
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    if (param.docId) {
      paramUnitID   = param.docId.split(';')[0];
      result.unitid = paramUnitID.split('/')[1].replace('.xml', '');
    }

  }

  return result;
});

