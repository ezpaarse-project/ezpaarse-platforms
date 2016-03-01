#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Navis Fiscal
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/EFL2\/DOCUMENT\/VIEW\/documentViewUDFrame\.do$/.exec(path)) !== null) {
    // http://abonnes.efl.fr/EFL2/DOCUMENT/VIEW/documentViewUDFrame.do?key=BF1511&refId=_JVID_BF1511_1
    result.rtype = 'JURISPRUDENCE';
    result.mime = 'HTML';
    result.title_id = param.key;
    if (param.refId)
      result.unitid = param.refId;
    /* http://abonnes.efl.fr/EFL2/DOCUMENT/VIEW/documentViewUDFrame.do?key=RJF15
     */
  } else if ((match = /^\/PDF\/2015\/([a-zA-Z]+\d+)\/Default\.html$/.exec(path)) !== null) {
    // http://abonnes.efl.fr/PDF/2015/FR1546/Default.html
    result.rtype = 'BOOK';
    result.mime = 'MISC';
    result.title_id = match[1];
  } else if ((match = /^\/portail\/actusdetail\.no$/.exec(path)) !== null) {
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.title_id = param.ezId;
  }
  return result;
});