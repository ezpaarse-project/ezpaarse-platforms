#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform JurisEdit
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/membres\/files\/resultats.php$/i.test(path)) {
    // /membres/files/resultats.php?base=jurissoc&file=L270516_RCS.htm
    // /membres/files/resultats.php?base=juriscomintegral&file=20210506-CAS-2020-00080.pdf
    result.rtype    = 'JURISPRUDENCE';

    if ((match = /^([a-z0-9_-]+)\.([a-z]+)$/i.exec(param.file)) !== null) {
      result.unitid = match[1];
      if (match[2] === 'htm') {
        result.mime = 'HTML';
      }
      if (match[2] === 'pdf') {
        result.mime = 'PDF';
      }
    }
  } else if (/^\/membres\/jurisindex.php$/i.test(path)) {
    // /jurisindex.php?action=watch&cate=15&file=16.pdf&page=3
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';

    const file = /^([0-9]+)\.pdf$/i.exec(param.file);

    result.unitid = `${param.cate}/${file[1]}/${param.page}`;
  } else if ((match = /^\/membres\/destination\/([a-z0-9-_]+)\.htm$/i.exec(path)) !== null) {
    // /membres/destination/CSJ_19111874.htm
    result.rtype = 'REPORT';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/membres\/files\/bancaire\/([a-z0-9-_]+)\.pdf$/i.exec(path)) !== null) {
    // /files/bancaire/CSSF_1726.pdf
    result.rtype = 'REPORT';
    result.mime = 'PDF';
    result.unitid = match[1];
  } else if (/^\/membres\/destination\/fichier.php$/i.test(path)) {
    // /membres/destination/fichier.php?fich=K0604C3811K3606.htm
    result.rtype = 'JURISPRUDENCE';
    result.mime = 'HTML';

    const fich = /^([a-z0-9]+)\.htm$/i.exec(param.fich);

    result.unitid = fich[1];
  }

  return result;
});
