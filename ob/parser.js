#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Oxford Bibliographies
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://www.oxfordbibliographies.com/search?sticky=true&type=document&q=terrorism&searchBtn=Search&module_0=obo-9780199846733&module_1=obo-9780199827251&module_2=obo-9780199730414&module_3=obo-9780195393361&module_4=obo-9780199846719&module_5=obo-9780195393521&module_6=obo-9780199920082&module_7=obo-9780199791286&module_8=obo-9780195389661&module_9=obo-9780195399318&module_10=obo-9780199796953&module_11=obo-9780195390155&module_12=obo-9780199840731&module_13=obo-9780199913701&module_14=obo-9780190221911&module_15=obo-9780195396584&module_16=obo-9780199791279&module_17=obo-9780199757824&module_18=obo-9780195396577&module_19=obo-9780195399301&module_20=obo-9780199799558
    // https://www.oxfordbibliographies.com/search?sticky=true&type=document&q=economy&searchBtn=Search&module_0=obo-9780199846733&module_1=obo-9780199827251&module_2=obo-9780199730414&module_3=obo-9780195393361&module_4=obo-9780199846719&module_5=obo-9780195393521&module_6=obo-9780199920082&module_7=obo-9780199791286&module_8=obo-9780195389661&module_9=obo-9780195399318&module_10=obo-9780199796953&module_11=obo-9780195390155&module_12=obo-9780199840731&module_13=obo-9780199913701&module_14=obo-9780190221911&module_15=obo-9780195396584&module_16=obo-9780199791279&module_17=obo-9780199757824&module_18=obo-9780195396577&module_19=obo-9780195399301&module_20=obo-9780199799558
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/display\/document\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+).xml$/i.exec(path)) !== null) {
    // https://www.oxfordbibliographies.com/display/document/obo-9780199941728/obo-9780199941728-0110.xml?rskey=9t8ng0&result=1#obo-9780199941728-0110-div1-0004
    // https://www.oxfordbibliographies.com/display/document/obo-9780199941728/obo-9780199941728-0024.xml?rskey=9t8ng0&result=7#null
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.online_identifier = match[1].split('-')[1];
    result.unitid = `${match[1]}/${match[2]}.xml?rskey=${param.rskey}&result=${param.result}${parsedUrl.hash}`;
  }

  return result;
});
