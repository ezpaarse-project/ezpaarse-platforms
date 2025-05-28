#!/usr/bin/env node

/**
 * parser for www.annualreviews.org platform
 * http://analyses.ezpaarse.org/platforms/annualreviews/
 */
'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/(journal|loi|toc)\/([a-z]+[0-9]?)(\/current)?$/.exec(path)) !== null) {
    // /journal/achre4
    // /toc/achre4/current
    result.title_id = match[2];
    result.unitid = match[2] + (match[3] || '');
    result.rtype = 'TOC';
    result.mime = 'MISC';

  } else if ((match = /\/toc\/([a-z]+[0-9]?)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // /toc/achre4/46/4
    result.unitid = match[1] + '/' + match[2] + '/' + match[3];
    result.title_id = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
    result.vol = match[2];
    result.issue = match[3];

  } else if ((match = /^\/doi\/(abs|pdf|full)\/([0-9]{2}\.[0-9]{4}\/(annurev[.-]([a-z]+)[.\-0-9-a-z]+))$/.exec(path)) !== null) {
    // http://www.annualreviews.org.gate1.inist.fr/doi/abs/10.1146/annurev-neuro-062111-150343
    // http://www.annualreviews.org.gate1.inist.fr/doi/pdf/10.1146/annurev.anchem.1.031207.113026
    // http://www.annualreviews.org.insmi.bib.cnrs.fr/doi/full/10.1146/annurev-st-04-022817-100001
    result.doi = match[2];
    result.unitid = match[3];
    result.title_id = match[4];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      break;
    }
  } else if ((match = /^\/docserver\/fulltext\/[a-z]+\/[0-9]+\/[0-9]+\/([a-z0-9-.]+)\.(pdf|html)$/.exec(path)) !== null) {
    // /docserver/fulltext/animal/13/1/annurev-animal-111523-102004.pdf?expires=1747722838&id=id&accname=ar-366340&checksum=B8ABBEB18BA2C8A5BAFEF36576F7F511
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[1];
    result.doi = `${10.1146}/${match[1]}`;
  } else if ((match = /^\/content\/journals\/([0-9]{2}\.[0-9]{4}\/(annurev[.-]([a-z]+)[.\-0-9-a-z]+))$/.exec(path)) !== null) {
    // /content/journals/10.1146/annurev-astro-052722-105936
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.doi = `${10.1146}/${match[2]}`;
  } else if ((match = /^\/content\/journals\/([a-z0-9]+)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // /content/journals/astro/62/1
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = `${match[1]}/${match[2]}/${match[3]}`;
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
  }


  return result;
});
