#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Plus Pli
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

  if (/^\/Search\/Result$/i.test(path)) {
    // https://plus.pli.edu/Search/Result?q=Finances&fq=f_year~3a285b~2018~20~TO~202a5d29~&qt=legal_boolean&sort=score%20desc,s_date%20desc&rows=10&fq=~2b~f_entity_type~3a2822~Course~20~Handbooks~222022~Treatises~222022~Answer~20~Books~222022~Journals~22202022~Insights~2229~
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/Details\/Details$/i.test(path) && param.fq.includes('CH')) {
    // https://plus.pli.edu/Details/Details?rows=10&sort=score%20desc%2Cs_date%20desc&fq=f_year~3A285B~2018~20~TO~202A5D29~%2C~2B~f_entity_type~3A2822~Course~20~Handbooks~222022~Treatises~222022~Answer~20~Books~222022~Journals~222022~Insights~2229~%2C~2B~id~3A282B22~293924-CH9~2229~&qt=legal_boolean&q=Finances
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
  } else if (/^\/Details\/download-file$/i.test(path)) {
    // https://plus.pli.edu/Details/download-file?recordId=251669-ATL4&format=PDF
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.recordId;
  } else if (/^\/Details\/Details$/i.test(path) && param.fq.includes('TOC')) {
    // https://plus.pli.edu/Details/Details?rows=10&fq=title_id~3A2822~290185~2229202B~id~3A282B22~290185-TOC~2229~&facet=true&qt=legal_boolean&mode=Group_By_Series
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/Details\/Details$/i.test(path)) {
    // https://plus.pli.edu/Details/Details?start=0&rows=10&sort=score%20desc%2Cs_date%20desc&fq=f_year~3A285B~2018~20~TO~202A5D29~%2C~2B~f_entity_type~3A2822~Journals~2229~%2C~2B~id~3A282B22~268427-ATL3~2229~&qt=legal_boolean&q=Finances
    // https://plus.pli.edu/Details/Details?start=0&rows=10&sort=score%20desc%2Cs_date%20desc&fq=f_year~3A285B~2018~20~TO~202A5D29~%2C~2B~f_entity_type~3A2822~Transcripts~2229~%2C~2B~id~3A282B22~257003~2229~&qt=legal_boolean&q=Finances
    // https://plus.pli.edu/Details/Details?start=0&rows=10&sort=score%20desc%2Cs_date%20desc&fq=f_year~3A285B~2018~20~TO~202A5D29~%2C~2B~f_entity_type~3A2822~Insights~2229~%2C~2B~id~3A282B22~315011-ATL13~2229~&qt=legal_boolean&q=crime
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  }
  return result;
});
