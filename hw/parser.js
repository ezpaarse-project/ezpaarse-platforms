#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl, ec) {

  const path     = parsedUrl.pathname;
  const hostname = parsedUrl.hostname;
  const query    = parsedUrl.query || {};
  const fileSize = parseInt(ec.size, 10);

  let result = {};
  let match;

  result.title_id = hostname;

  // if the size is less than 10ko, it's not the actual article but a login page
  if (fileSize && fileSize < 10000) {
    result._granted = false;
  }

  if (path.startsWith('/content/suppl')) {
    // /content/suppl/2014/02/03/JCO.2013.50.9539.DC1/DS1_JCO.2013.50.9539.pdf
    const reg = new RegExp('^/content/suppl/(\\d+)/(\\d+/\\d+/([\\w\\.]+/)?[\\w\\.]+?)\\.pdf');

    if ((match = reg.exec(path)) !== null) {
      result.rtype  = 'SUPPL';
      result.mime   = 'PDF';
      result.unitid = `${hostname}/${match[2]}`;
    }

  } else if (path.startsWith('/content')) {
    if (query.abspop) { return {}; }

    const extReg = '(?:\\.(abstract|full|full\\.pdf|pdf|toc))?$';

    // /content/6/4/458.full
    // /content/78/2/B49.full
    // /content/2012/5/pdb.top069344.full.pdf
    // /content/1/2-3/69.1.full.pdf+html
    const reg1 = new RegExp(`^/content/(?:[a-z]+/)?((\\d+)/(\\d+(?:-\\d+)?)/([\\w\\.]+?))${extReg}`);

    // /content/bmj/343/bmj.d4464.full.pdf
    // /content/bloodjournal/early/2015/02/25/blood-2014-10-608596.full.pdf
    const reg2 = new RegExp(`^/content/\\w+/(?:early/)?((?:\\d+/\\d+/)?\\d+/[\\w\\-\\.]+?)${extReg}`);

    // /content/343/bmj.d4285
    // /content/188/3.toc
    const reg3 = new RegExp(`^/content/(\\d+)/([\\w\\.]+?)${extReg}`);

    let extension;

    if ((match = reg1.exec(path)) !== null) {
      extension = match[5] || 'full';
      result.unitid = `${hostname}/${match[1]}`;

      const firstPage = match[4].split('.')[0];

      if (firstPage !== 'pdb') {
        result.vol        = match[2];
        result.issue      = match[3];
        result.first_page = firstPage;
      }

    } else if ((match = reg2.exec(path)) !== null) {
      extension     = match[2] || 'full';
      result.unitid = `${hostname}/${match[1]}`;

    } else if ((match = reg3.exec(path)) !== null) {
      extension     = match[3] || 'full';
      result.vol    = match[1];
      result.unitid = `${hostname}/${match[1]}/${match[2]}`;

      if (/^\d+$/.test(match[2])) {
        result.issue = match[2];
      }
    }

    switch (extension) {
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'full.pdf':
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'toc':
      result.rtype = 'TOC';
      result.mime  = 'HTML';
      break;
    }

  } else if (path.startsWith('/cgi/reprint')) {

    const reg = new RegExp('^/cgi/reprint/(\\w+;(\\d+)/(\\d+)/(\\d+))$');

    if ((match = reg.exec(path)) !== null) {
      // http://preventionportal.aacrjournals.org/cgi/reprint/canres;74/16/4378

      result.unitid = `${hostname}/${match[1]}`;
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';

      result.vol        = match[2];
      result.issue      = match[3];
      result.first_page = match[4];
    }

  } else if (path.startsWith('/docserver')) {
    // http://www.sgmjournals.org/docserver/fulltext/ijsem/65/8/2410_ijs000272.pdf
    const docReg = new RegExp('^/docserver/\\w+/(\\w+/\\d+/\\d+/\\w+)\\.pdf$');

    if ((match = docReg.exec(path)) !== null) {
      result.unitid = `${hostname}/${match[1]}`;
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }
  } else if ((match = /^\/\w+\/(\d+\/(?:\w+\/)?\w+)\.(pdf|htm)/.exec(path)) !== null) {
    // /bj/467/bj4670193.htm;
    // /bj/467/bj4670345ntsadd.pdf;
    // /bst/028/0575/0280575.pdf;
    // /bsr/035/e182/bsr035e182.htm;
    // /bst/042/1/default.htm?s=0;

    if (match[1].endsWith('/default')) {
      result.unitid = `${hostname}/${match[1].slice(0, -8)}`;
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
    } else {
      result.unitid = `${hostname}/${match[1]}`;
      result.rtype  = 'ARTICLE';
      result.mime   = (match[2] === 'pdf' ? 'PDF' : 'HTML');
    }
  } else if (/^\/\w+\/toc\.htm/.test(path)) {
    // /bsr/toc.htm;
    result.unitid = hostname;
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
  }

  // do not return ECs with empty rtype and empty mime
  if (!result.rtype && !result.mime) {
    result = {};
  }

  return result;
});
