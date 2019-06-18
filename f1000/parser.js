#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Faculty 1000
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

  if (/^\/prime\/sections$|browse|search$|topics/i.test(path)) {
    // https://f1000.com:443/prime/sections?keywords=rainbow+environment+forest&hp=2
    // https://f1000research.com:443/search?q=rainbow
    // https://f1000research.com:443/browse/documents?&selectedDomain=documents
    // https://blog.f1000.com:443/topics/open-data/
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/prime\/recommendations\/all$/i.test(path)) {
    // https://f1000.com:443/prime/recommendations/all?fieldsCriteria[0].fieldName=all&fieldsCriteria[0].operator=AND&fieldsCriteria[0].value=rainbow
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/(gateways|collections)\/([A-z]+)$/i.exec(path)) !== null) {
    // https://f1000research.com:443/gateways/disease_outbreaks
    // https://f1000research.com:443/gateways/disease_outbreaks?selectedDomain=documents
    // https://f1000research.com:443/collections/BOSC
    // https://f1000research.com:443/collections/BOSC?selectedDomain=slides
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    if (param.selectedDomain) {
      result.unitid = match[2] + '/' + param.selectedDomain;
    } else {
      result.unitid = match[2];
    }

  } else if ((match = /^\/(collections|posters)\/((([0-z-]+)\/([0-z-]+))|([0-9-]+))/i.exec(path)) !== null) {
    // https://f1000research.com:443/collections/BOSC/about-this-collection
    // https://f1000research.com:443/posters/6-499
    result.rtype = 'REF';
    result.mime  = 'HTML';
    result.unitid = match[2];
    result.title_id = match[2];

  } else if ((match = /^\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://blog.f1000.com:443/2010/07/06/a-biologist-a-chemist-and-a-physicist-walk-into-a-bar/
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.unitid = match[1] + '/' + match[2] + '/' + match[3] + '/' + match[4];
    result.title_id = match[1] + '/' + match[2] + '/' + match[3] + '/' + match[4];
  } else if (((match = /^\/prime\/([0-9]+)$/i.exec(path)) !== null) || ((match = /^\/articles\/([0-9-]{5}\/v[0-9]+)$/i.exec(path)) !== null) || ((match = /^\/documents\/([0-9-]{6})$/i.exec(path)) !== null) || ((match = /^\/slides\/([0-9-]{5})$/i.exec(path)) !== null) || ((match = /^\/prime\/interaction\/openarticle\/([0-9]+)$/i.exec(path)) !== null)) {
    // https://f1000research.com:443/articles/7-208/v1
    // https://f1000research.com:443/documents/7-1444
    // https://f1000research.com:443/slides/7-636
    // https://f1000.com:443/prime/1028491
    // https://f1000.com:443/prime/interaction/openarticle/735502654
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if (/^\/stats-pmc\/downloads-views$/i.test(path)) {
    // https://f1000research.com:443/stats-pmc/downloads-views?doi=10.12688%2Ff1000research.10851.1
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.title_id = param.doi;
    result.unitid = param.doi;
    result.doi = param.doi;
  }

  return result;
});
