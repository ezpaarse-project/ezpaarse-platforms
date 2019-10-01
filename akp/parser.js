#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Africa Knowledge Project 
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  //  let param = parsedUrl.query || {};

  let match;

  if ((match = /^\/index.php\/([a-z]+)\/search\/search$/i.exec(path)) !== null) {
    // https://www.africaknowledgeproject.org:443/index.php/index/search/search
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';
    if (match[1] == 'amd') {
      result.publication_title = 'African Music Database';
    } else if (match[1] == 'bwd') {
      result.publication_title = 'Biafran War Database';
    } else if (match[1] == 'erald') {
      result.publication_title = 'Enriching Resource Document & Language Archive';
    } else if (match[1] == 'ijele') {
      result.publication_title = 'Ijele: Art eJournal of the African World';
    } else if (match[1] == 'index') {
      result.publication_title = 'Africa Knowledge Project';
    } else if (match[1] == 'jap') {
      result.publication_title = 'Journal on African Philosophy';
    } else if (match[1] == 'jenda') {
      result.publication_title = 'JENdA: A Journal of Culture and African Women Studies';
    } else if (match[1] == 'ksd') {
      result.publication_title = 'Kiswahili Story Database';
    } else if (match[1] == 'proudflesh') {
      result.publication_title = 'ProudFlesh: New Afrikan Journal of Culture, Politics and Consciousness';
    } else if (match[1] == 'war') {
      result.publication_title = 'West Africa Review';
    }

  } else if (((match = /^\/index.php\/([a-z]+)\/issue\/([a-z]+)$/i.exec(path)) !== null) || ((match = /^\/index.php\/([a-z]+)\/issue\/view\/([0-9]+)$/i.exec(path)) !== null) || ((match = /^\/index.php\/([a-z]+)\/issue\/view\/([0-9]+)\/showToc$/i.exec(path)) !== null)) {
    // https://www.africaknowledgeproject.org:443/index.php/erald/issue/archive
    // https://www.africaknowledgeproject.org:443/index.php/jenda/issue/view/272
    // https://www.africaknowledgeproject.org:443/index.php/amd/issue/view/303/showToc
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[2];
    if (match[1] == 'amd') {
      result.publication_title = 'African Music Database';
    } else if (match[1] == 'bwd') {
      result.publication_title = 'Biafran War Database';
    } else if (match[1] == 'erald') {
      result.publication_title = 'Enriching Resource Document & Language Archive';
    } else if (match[1] == 'ijele') {
      result.publication_title = 'Ijele: Art eJournal of the African World';
    } else if (match[1] == 'index') {
      result.publication_title = 'Africa Knowledge Project';
    } else if (match[1] == 'jap') {
      result.publication_title = 'Journal on African Philosophy';
    } else if (match[1] == 'jenda') {
      result.publication_title = 'JENdA: A Journal of Culture and African Women Studies';
    } else if (match[1] == 'ksd') {
      result.publication_title = 'Kiswahili Story Database';
    } else if (match[1] == 'proudflesh') {
      result.publication_title = 'ProudFlesh: New Afrikan Journal of Culture, Politics and Consciousness';
    } else if (match[1] == 'war') {
      result.publication_title = 'West Africa Review';
    }

  } else if ((match = /^\/index.php\/([a-z]+)\/article\/view\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.africaknowledgeproject.org:443/index.php/amd/article/view/3437
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[2];
    if (match[1] == 'amd') {
      result.publication_title = 'African Music Database';
    } else if (match[1] == 'bwd') {
      result.publication_title = 'Biafran War Database';
    } else if (match[1] == 'erald') {
      result.publication_title = 'Enriching Resource Document & Language Archive';
    } else if (match[1] == 'ijele') {
      result.publication_title = 'Ijele: Art eJournal of the African World';
    } else if (match[1] == 'index') {
      result.publication_title = 'Africa Knowledge Project';
    } else if (match[1] == 'jap') {
      result.publication_title = 'Journal on African Philosophy';
    } else if (match[1] == 'jenda') {
      result.publication_title = 'JENdA: A Journal of Culture and African Women Studies';
    } else if (match[1] == 'ksd') {
      result.publication_title = 'Kiswahili Story Database';
    } else if (match[1] == 'proudflesh') {
      result.publication_title = 'ProudFlesh: New Afrikan Journal of Culture, Politics and Consciousness';
    } else if (match[1] == 'war') {
      result.publication_title = 'West Africa Review';
    }

  } else if ((match = /^\/index.php\/([a-z]+)\/article\/(view)\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.africaknowledgeproject.org:443/index.php/amd/article/view/3437
    result.title_id = match[3] + '/' + match[4];
    result.unitid   = match[3] + '/' + match[4];
    if (match[1] == 'amd') {
      result.publication_title = 'African Music Database';
      result.rtype    = 'AUDIO';
      result.mime     = 'MISC';
    } else if (match[1] == 'bwd') {
      result.publication_title = 'Biafran War Database';
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'erald') {
      result.publication_title = 'Enriching Resource Document & Language Archive';
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'ijele') {
      result.publication_title = 'Ijele: Art eJournal of the African World';
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'index') {
      result.publication_title = 'Africa Knowledge Project';
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'jap') {
      result.publication_title = 'Journal on African Philosophy';
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'jenda') {
      result.publication_title = 'JENdA: A Journal of Culture and African Women Studies';
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'ksd') {
      result.publication_title = 'Kiswahili Story Database';
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'proudflesh') {
      result.publication_title = 'ProudFlesh: New Afrikan Journal of Culture, Politics and Consciousness';
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'war') {
      result.publication_title = 'West Africa Review';
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    }

  } else if ((match = /^\/index.php\/([a-z]+)\/article\/(download)\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.africaknowledgeproject.org:443/index.php/amd/article/view/3437
    result.title_id = match[3] + '/' + match[4];
    result.unitid   = match[3] + '/' + match[4];
    if (match[1] == 'amd') {
      result.publication_title = 'African Music Database';
      result.rtype    = 'AUDIO';
      result.mime     = 'MISC';
    } else if (match[1] == 'bwd') {
      result.publication_title = 'Biafran War Database';
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[1] == 'erald') {
      result.publication_title = 'Enriching Resource Document & Language Archive';
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[1] == 'ijele') {
      result.publication_title = 'Ijele: Art eJournal of the African World';
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[1] == 'index') {
      result.publication_title = 'Africa Knowledge Project';
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[1] == 'jap') {
      result.publication_title = 'Journal on African Philosophy';
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[1] == 'jenda') {
      result.publication_title = 'JENdA: A Journal of Culture and African Women Studies';
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[1] == 'ksd') {
      result.publication_title = 'Kiswahili Story Database';
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[1] == 'proudflesh') {
      result.publication_title = 'ProudFlesh: New Afrikan Journal of Culture, Politics and Consciousness';
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[1] == 'war') {
      result.publication_title = 'West Africa Review';
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    }

  }

  return result;
});
