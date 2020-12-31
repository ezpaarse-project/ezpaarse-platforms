#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Fiscaal Totaal
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

  if (/^\/Content\/Pages\/LoonAlmanakToc.aspx$/i.test(path) == true) {
    // https://professional.fiscaaltotaal.nl/Content/Pages/LoonAlmanakToc.aspx?b=5e9be1e4-a49b-51ab-88e1-a80a393b2e67
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.b;

  } else if (/^\/Content\/Pages\/LoonAlmanakContent.aspx$/i.test(path) == true) {
    // https://professional.fiscaaltotaal.nl/Content/Pages/LoonAlmanakContent.aspx?c=3cb8e018-27ce-5c9d-8639-2d723eda6a15
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = param.c;
  } else if (/^\/Pages\/Zoekresultaten.aspx$/i.test(path) == true) {
    // https://professional.fiscaaltotaal.nl/Pages/Zoekresultaten.aspx?view=ftallessppublished&k=Employees
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/Content\/Pages\/ViewVakliteratuur.aspx$/i.test(path) == true || /^\/Content\/Pages\/viewnieuws.aspx$/i.test(path) == true) {
    // https://professional.fiscaaltotaal.nl/Content/Pages/ViewVakliteratuur.aspx?id=78d6b201-374b-4f8c-8bc9-3e909cedec66
    // https://professional.fiscaaltotaal.nl/Content/Pages/viewnieuws.aspx?id=a2a14952-e089-4f4c-9a66-a5b6be41dd88
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  }

  return result;
});
