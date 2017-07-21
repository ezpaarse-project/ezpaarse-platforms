#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Irevues : partie LODEL
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

  if ((match = /^\/(([a-zA-Z0-9-]+)\/([a-zA-Z0-9/]+\.pdf))$/.exec(path)) !== null) {
    // http://lodel.irevues.inist.fr/saintjacquesinfo/docannexe/file/970/boheme.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/([a-zA-Z0-9-]+)\/$/.exec(path)) !== null) {
    // http://lodel.irevues.inist.fr/oeiletphysiologiedelavision/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/([a-zA-Z0-9-]+)\/index.php$/.exec(path)) !== null) {
    // ttp://lodel.irevues.inist.fr/saintjacquesinfo/index.php?id=1088
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];

    if (param.id) {
      result.unitid = match[1] + '/' + param.id;
    }
  }

  return result;
});

