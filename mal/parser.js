#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let info;
  let match;

  if ((match = /^\/([a-z]+)$/i.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/dna
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/toc\/(([a-z]+)\/([0-9.]+)\/([^/]+))$/i.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/toc/dna/32/1
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.vol      = match[3];
    result.issue    = match[4];
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/doi\/abs\/([0-9.]+\/([^/.]+)\.([^/]+))$/i.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/doi/abs/10.1089/dna.2012.1776
    info = match[1].split('.');
    result.rtype    = 'ABS';
    result.mime     = 'MISC';
    result.title_id = match[2];
    result.unitid   = result.doi = match[1];
    result.unitid   = match[2] + '.' + match[3];
    result.publication_date = info[2].substring(0, 4);

  } else if ((match = /^\/doi(\/full)?\/(([0-9.]+)\/(([^.]+)\.[0-9]{4}[-\W].*))$/i.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/doi/full/10.1089/dna.2012.1776
    // https://www-liebertpub-com.insb.bib.cnrs.fr/doi/10.1089/sur.2019-29015-df
    // /doi/10.1089/hgtb.2018.041
    info = match[2].split('.');
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[5];
    result.unitid   = result.doi = match[2];
    result.unitid   = match[4];
    result.publication_date = info[2].substring(0, 4);

  } else if ((match = /^\/doi\/pdf(?:plus)?\/([0-9.]+\/([a-z]+)\.([0-9a-z.-]+))$/i.exec(path)) !== null) {
    // /doi/pdf/10.1089/dna.2012.1776
    // /doi/pdfplus/10.1089/dna.2012.1776
    // /doi/pdf/10.1089/sur.2018.29014.df
    // /doi/pdf/10.1089/sur.2019-29015-df
    // /doi/pdf/10.1089/DERM.0000000000000905
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

    result.title_id = match[2];
    result.doi      = match[1];
    result.unitid   = `${match[2]}.${match[3]}`;

    const info = /^([0-9]{4})[.-]/.exec(match[3] || '');
    if (info && info[1]) {
      result.publication_date = info[1];
    }
  }

  return result;
});