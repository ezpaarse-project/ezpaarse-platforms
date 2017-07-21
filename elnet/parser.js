#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme ELnet
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

  if (/^\/documentation\/Document$/i.test(path)) {
    // http://www.elnet.fr/documentation/Document?id=Y4IDXJRP
    result.rtype = 'ARTICLE';
    result.mime  = 'MISC';

    if (param.id) {
      result.title_id = param.id;
      result.unitid   = param.id;
    }

    let idMatch = /(CODE|JRP|TXT|FORM|ET)$/.exec(param.FromId);

    if (idMatch) {
      // http://www.elnet.fr/documentation/Document?id=ASSU&FromId=Z4LSTCODE
      // http://www.elnet.fr/documentation/Document?id=A197461&FromId=Y4IDXJRP
      // http://www.elnet.fr/documentation/Document?id=Y3M08&FromId=Y3LSTFORM
      // http://www.elnet.fr/documentation/Document?id=Y3LSTET-1
      switch (idMatch[1]) {
      case 'CODE':
        result.rtype = 'CODES';
        break;
      case 'JRP':
        result.rtype = 'JURISPRUDENCE';
        break;
      case 'FORM':
        result.rtype = 'FORMULES';
        break;
      case 'ET':
        result.rtype = 'ARTICLE';
        break;
      }
    }
  } else if ((match = /^\/documentation\/hulkStatic\/EL\/(.*)\/([^/]+)\.pdf$/i.exec(path)) !== null) {
    // http://www.elnet.fr/documentation/hulkStatic/EL/CD13/DPFORM2/Y3M10/sharp_/ANX/y3m313001.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[2];

    if (match[1] && match[1].indexOf('FORM') != -1) {
      result.rtype = 'FORMULES';
    }
  } else if ((match = /^\/aboveille\/(editdoc|logon)\.do$/i.exec(path)) !== null) {
    // http://www.editions-legislatives.fr/aboveille/editdoc.do?attId=150868
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

    if (match[1] === 'logon') {
      result.mime = 'HTML';
    }
    if (param.attId) {
      result.title_id = param.attId;
      result.unitid   = param.attId;
    }
  }

  return result;
});

