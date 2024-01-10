#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const doiPrefix = '10.3791';

/**
 * Identifie les consultations de la plateforme jove
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

  if ((match = /^\/(video|science-education)\/([0-9]+)\/[a-z0-9-]+?$/i.exec(path)) !== null) {
    // /video/54732/determination-relative-cell-surface-total-expression-recombinant-ion
    // /science-education/5019/une-introduction-la-centrifugeuse?language=French
    result.unitid = match[2];

    if (match[1].toLowerCase() === 'video') {
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      result.doi   = `${doiPrefix}/${match[2]}`;
    } else {
      result.rtype = 'VIDEO';
      result.mime  = 'MISC';
    }
  } else if ((match = /^\/(v|t)\/([0-9]+)\/[a-z0-9-]+$/i.exec(path)) !== null) {
    // https://www.jove.com/v/64425/a-soluble-tetrazolium-based-reduction-assay-to-evaluate-the-effect-of-antibodies-on-candida-tropicalis-biofilms
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.unitid = match[2];
    result.doi    = `${doiPrefix}/${match[2]}`;

  } else if ((match = /^\/pdf(?:-materials)?\/([0-9]+)\/[a-z0-9-]+?$/i.exec(path)) !== null) {
    // /pdf/54732/jove-protocol-54732-determination-relative-cell-surface-total-expression-recombinant-ion
    // /pdf-materials/54732/jove-materials-54732-determination-relative-cell-surface-total-expression-recombinant-ion
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];
    result.doi    = `${doiPrefix}/${match[1]}`;

  } else if ((match = /^\/xml\/([0-9]+)$/i.exec(path)) !== null) {
    // /xml/54732
    result.rtype  = 'METADATA';
    result.mime   = 'XML';
    result.unitid = match[1];
    result.doi    = `${doiPrefix}/${match[1]}`;
  } else if (/^\/api\/articles\/v[0-9]+\/GetRIS\.php$/i.test(path)) {
    // /api/articles/v0/GetRIS.php?id=54732
    result.rtype = 'METADATA';
    result.mime  = 'RIS';

    if (param.id) {
      result.unitid = param.id;
      result.doi    = `${doiPrefix}/${param.id}`;
    }

  } else if ((match = /^\/author\/([a-z_-]+)$/i.exec(path)) !== null) {
    // /author/Emilie_Segura
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
    result.unitid = match[1].toLowerCase();

  } else if ((match = /^\/archive\/([0-9]+)\/[a-z0-9-]+$/i.exec(path)) !== null) {
    // /archive/112/june-2016
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
    result.unitid = match[1];
    result.issue  = match[1];
  } else if ((match = /^\/institutions\/[a-z-]+\/[a-z-]+\/[a-z-]+\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /institutions/NA-north-america/US-united-states/CA-california/16242-university-of-california-irvine
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/(biology|archive)$/i.exec(path)) !== null) {
    // /biology
    // /archive
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if (/^(\/api\/free)?\/search\/?$/i.test(path)) {
    // /search?query=covid&content_type=&page=1
    // /api/free/search/?query=automobiles&content_type=journal_content&page=1&from=&to=
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';

  } else if ((match = /^\/api\/article\/pdf\/([0-9]+)$/i.exec(path)) !== null) {
    // /api/article/pdf/64404
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[1];
    result.doi = `${doiPrefix}/${match[1]}`;

  } else if ((match = /^\/api\/free\/article\/[a-z]+\/([0-9]+)$/i.exec(path)) !== null) {
    // /api/free/article/en/53631
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.doi = `${doiPrefix}/${match[1]}`;

  }
  return result;
});
