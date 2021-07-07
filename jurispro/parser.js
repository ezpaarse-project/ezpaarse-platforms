#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Juris Professionell
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path = parsedUrl.pathname;
  const param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/jportal\/recherche3doc\/([a-z0-9._-]+)\.(pdf|rtf)$/i.exec(path)) !== null) {
    // /jportal/recherche3doc/BVerfG_1_BvR_16-13_KVRE434101901.pdf?json=%7B%22format%22%3A%22pdf%22%2C%22docPart%22%3A%22L%22%2C%22docId%22%3A%22KVRE434101901%22%2C%22portalId%22%3A%22jurisw%22%7D&_=%2FBVerfG_1_BvR_16-13_KVRE434101901.pdf
    // /jportal/recherche3doc/BVerfG_1_BvR_16-13_KVRE434101901.rtf?json=%7B%22format%22%3A%22rtf%22%2C%22docPart%22%3A%22L%22%2C%22docId%22%3A%22KVRE434101901%22%2C%22portalId%22%3A%22jurisw%22%7D&_=%2FBVerfG_1_BvR_16-13_KVRE434101901.rtf
    // /jportal/recherche3doc/samson-ovsAIZD0008030804.pdf?json=%7B%22format%22%3A%22pdf%22%2C%22docPart%22%3A%22C%22%2C%22docId%22%3A%22samson-ovsAIZD0008030804%22%2C%22portalId%22%3A%22jurisw%22%7D&_=%2Fsamson-ovsAIZD0008030804.pdf
    result.mime   = match[2].toUpperCase();
    result.unitid = match[1];

    let docPart;

    try {
      const json = JSON.parse(param.json);
      if (json && typeof json.docPart === 'string') {
        docPart = json.docPart.toUpperCase();
      }
    } catch (e) {
      docPart = null;
    }


    if (docPart === 'C') {
      result.rtype = 'CODE_JURIDIQUE';
    } else if (docPart === 'L') {
      result.rtype = 'JURISPRUDENCE';
    }
  }

  return result;
});
