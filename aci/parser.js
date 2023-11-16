#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Concrete Institute
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

  if (/^\/publications\/getarticle\.aspx$/i.test(path)) {
    // https://www.concrete.org/publications/getarticle.aspx?m=icap&pubid=51738829
    // https://www.concrete.org/publications/getarticle.aspx?m=icap&pubid=51739193
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = param.pubid;

  } else if (/^\/publications\/internationalconcreteabstractsportal\.aspx$/i.test(path) && param.id) {
    // https://www.concrete.org/publications/internationalconcreteabstractsportal.aspx?m=details&id=51739193
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  } else if ((match = /^\/publications\/([a-z]+)\/currentissue\.aspx$/i.exec(path)) !== null) {
    // https://www.concrete.org/publications/acistructuraljournal/currentissue.aspx
    // https://www.concrete.org/publications/acimaterialsjournal/currentissue.aspx
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/education\/([a-z]+)\/completelisting\.aspx$/i.exec(path)) !== null) {
    // https://www.concrete.org/education/freewebsessions/completelisting.aspx
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/publications\/internationalconcreteabstractsportal\.aspx$/i.test(path)) {
    // https://www.concrete.org/publications/internationalconcreteabstractsportal.aspx?m=results
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
