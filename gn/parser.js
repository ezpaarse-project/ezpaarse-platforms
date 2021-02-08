#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Garnier Numérique
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

  if (param.link) {
    let cleanLink = param.link.replace(/\s+/g, '');
    let type      = cleanLink.split('_');

    switch (type[1]) {
    case 'article':
      // numerique-bases/index.php?module=App&action=PanelText&link=jmp_article_17%09-A-%0A
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
      result.unitid = cleanLink;
      break;
    case 'tabmat':
      // numerique-bases/index.php?module=App&action=PanelTabmat&link=jmp_tabmat__tmxa_007
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = cleanLink;
      break;
    }
  } else if ((match = /^\/doi\/[a-z]+-([a-z]+)?$/.exec(path)) !== null) {
    // /doi/article-pdf?article=HpeMS02_9

    if (match[1] === 'pdf') {
      result.mime = 'PDF';
    }

    if (param.article) {
      result.rtype  = 'ARTICLE';
      result.unitid = param.article;
    }

  } else if ((match = /^\/blf\/index\.php$/.exec(path)) !== null) {
    // /blf/index.php?atknodetype=bibliographie.noticeconsultation&atkselector=notice.id%3D%27116913%27&atkaction=view&atklevel=1&atkprevlevel=0&atkstackid=5a200e816bedf
    // /blf/index.php?atklevel=2&atkprevlevel=2&atkstackid=5a200e816bedf&garnier-blf-saisie=1kiie3e972j2pgtmnc15902po6&atkescape=&phase=exportbatch_download&userid=153&forcedownload=false&export_record=116913&optionexport=optionexport_record&optionmethod=optionmethod_download&export_email=&export_filename=BLF_export_171130_1&optionformat=pdf#

    const format = (param.optionformat || '').toLowerCase();
    result.mime = format === 'pdf' ? 'PDF' : 'HTML';
    result.rtype = 'REF';

    if (param['export_record']) {
      result.unitid = param['export_record'];
    } else if (param.atkselector) {
      match = /notice\.id='(\d+)'/i.exec(param.atkselector);

      if (match !== null) {
        result.unitid = match[1];
      }
    }
  } else if ((match = /^\/(export\/pdf\/)?([a-z0-9-]+)\.html$/i.exec(path)) !== null) {
    let articleMatch;

    if ((articleMatch = /^([a-z0-9-]+?)(-[0-9-]*n-([0-9]+))/i.exec(match[2])) !== null) {
      // /the-balzac-review-revue-balzac-2019-n-2-l-interiorite-interiority-musique-et-vie-interieure-chez-balzac.html?displaymode=full
      result.mime     = match[1] ? 'PDF' : 'HTML';
      result.unitid   = match[2];
      result.title_id = articleMatch[1];
      result.issue    = articleMatch[3];

      if (param.displaymode === 'full') {
        result.rtype = 'ARTICLE';
      }
    } else if (match[1] || param.displaymode === 'full') {
      // /le-tablier-et-le-tarbouche-francs-macons-et-nationalisme-en-syrie-mandataire-l-emancipation-de-la-maconnerie-syrienne.html
      result.mime   = match[1] ? 'PDF' : 'HTML';
      result.unitid = match[2];

      if (param.displaymode === 'full') {
        result.rtype  = 'BOOK_SECTION';
      }
    }
  }

  return result;
});

