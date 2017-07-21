#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Intelex Past Masters
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/([a-z]+)\/([a-z_]+)\/([a-z_]+)\/([a-z0-9_.]+)\/([a-z0-9_.]+).pdf$/i.exec(path)) !== null) {
    // http://pm.nlx.com/xtf/page_pdfs/beauvoir_fr/beauvoir_fr.06/beauvoir_fr.06_00001.pdf
    result.rtype  = 'BOOK';
    result.mime   = 'PDF';
    result.unitid = match[5];

  } else if ((match = /^\/([a-z]+)\/view$/i.exec(path)) !== null) {
    //http://pm.nlx.com/xtf/view?docId=freud_de/freud_de.04.xml;chunk.id=div.freud.
    //v4.33;toc.depth=1;toc.id=;brand=default
    result.rtype = 'BOOK';
    result.mime  = 'HTML';

    if (param.docId) {
      let paramUnitID = param.docId.split(';')[0];
      result.unitid = paramUnitID.split('/')[1].replace('.xml', '');
    }
  }

  return result;
});

