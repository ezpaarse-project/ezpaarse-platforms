#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Taylor et Francis
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;

  let match;

  if ((match = /^\/doi\/(full|pdf|abs)\/([0-9.]+\/([0-9a-z.]+))$/.exec(path)) !== null) {
    result.doi    = match[2];
    result.unitid = match[3];

    if (/^[0-9]{8}/.test(match[3])) {
      result.print_identifier = match[3].substr(0, 4) + '-' + match[3].substr(4, 4);
      result.title_id         = result.print_identifier;
    }

    if (match[1].toUpperCase() == 'FULL') {
      // http://www.tandfonline.com.bases-doc.univ-lorraine.fr/doi/full/10.1080/17400309.2013.861174#abstract
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
    } else if (match[1].toUpperCase() == 'PDF') {
      // http://www.tandfonline.com:80/doi/pdf/10.1080/17400309.2013.861174
      // http://www-tandfonline-com.inshs.bib.cnrs.fr/doi/pdf/10.1179/amb.1991.38.1.1
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
    } else if (match[1].toUpperCase() == 'ABS') {
      // http://www.tandfonline.com:80/doi/abs/10.1080/00039420412331273295
      // http://www-tandfonline-com.inshs.bib.cnrs.fr/doi/abs/10.1179/amb.1991.38.1.1
      result.rtype = 'ABS';
      result.mime  = 'HTML';
    }
  } else if ((match = /^\/toc\/([a-zA-Z0-9]+)\/current$/.exec(path)) !== null) {
    // http://www.tandfonline.com:80/toc/gaan20/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/loi\/([a-zA-Z0-9]+)$/.exec(path)) !== null) {
    //loi/wjsa21
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
