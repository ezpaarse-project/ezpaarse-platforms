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

  if (param && param.link) {
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

    if (param && param.article) {
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
  }

  return result;
});

