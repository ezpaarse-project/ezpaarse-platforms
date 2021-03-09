#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Le monde
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);


  if (/^\/([a-z]+)\/article\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([0-9a-z-_]+).html$/i.test(path)) {
    // https://www.lemonde.fr/pixels/article/2021/01/20/investiture-de-joe-biden-les-soutiens-de-qanon-face-au-difficile-mur-de-la-realite_6066996_4408996.html
    // https://www.lemonde.fr/societe/article/2019/06/26/la-maire-de-montauban-refuse-d-ouvrir-un-centre-d-accueil-pour-les-sans-abri_5481713_3224.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

  } else if (/^\/recherche\/$/i.test(path)) {
    // https://www.lemonde.fr/recherche/?search_keywords=Biden&start_at=19%2F12%2F1944&end_at=20%2F01%2F2021&search_sort=relevance_desc
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
