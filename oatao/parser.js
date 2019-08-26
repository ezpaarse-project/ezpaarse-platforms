#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Open Archive Toulouse Archive Ouverte
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/([0-9]+)\/$/i.exec(path)) !== null) {
    // http://oatao.univ-toulouse.fr/24113/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];

  } else if ((match = /^\/cgi\/search\/archive\/advanced$/i.exec(path)) !== null) {
    // https://oatao.univ-toulouse.fr/cgi/search/archive/advanced?dataset=archive&screen=Search&documents_merge=ALL&documents=&title_merge=ALL&title=&creators_name_merge=ALL&creators_name=&instit_merge=ANY&affiliation_name_merge=ALL&affiliation_name=&affiliation_equipe_merge=ALL&affiliation_equipe=&abstract_merge=ALL&abstract=&keywords_merge=ALL&keywords=&type=book&issn_merge=ALL&issn=&publisher_merge=ALL&publisher=&publication_merge=ALL&publication=&date=&datestamp=&satisfyall=ALL&order=-date%3Bres%3Dyear%2Fcreators_name%2Ftitle&_action_search=Search
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/cgi\/search\/advanced$/i.exec(path)) !== null) {
    // https://oatao.univ-toulouse.fr/cgi/search/advanced
    result.rtype    = 'QUERY';
    result.mime     = 'HTML';

  } else if ((match = /^\/([0-9]+)\/1.haspreviewThumbnailVersion\/([^/]+)\.pdf$/i.exec(path)) !== null) {
    // http://oatao.univ-toulouse.fr/120/1.haspreviewThumbnailVersion/wawrzyniak_120.pdf
    result.rtype    = 'PREVIEW';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/view\/affil\/([^/]+)\.html$/i.exec(path)) !== null) {
    // http://oatao.univ-toulouse.fr/view/affil/Laboratoire_de_Chimie_Agro-Industrielle_-_LCA_=28Toulouse,_France=29.html
    result.rtype    = 'FICHE_ENTREPRISE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/view\/instit\/([^/]+)\.html$/i.exec(path)) !== null) {
    // http://oatao.univ-toulouse.fr/view/instit/Australian=5FNational=5FUniversity=5FANU.html
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/([0-9]+)\/([0-9]+)\/([^/]+)\.pdf$/i.exec(path)) !== null) {
    // http://oatao.univ-toulouse.fr/4892/1/Lochin_4892.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1] + '/' + match[2];
    result.unitid = match[3];
  }

  return result;
});
