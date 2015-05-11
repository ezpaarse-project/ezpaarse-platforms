#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;
  path = decodeURIComponent(path).replace(/\"/g, '');

  var match;

// console.log(path);

  if ((match = /\/reaxys\/secured\/(search.do)(;jsessionid=([A-Za-z0-9]+))?/.exec(path)) !== null) {
  // https://www-reaxys-com.chimie.gate.inist.fr/reaxys/secured/search.do;jsessionid=0EB47AD4DCFA2DCE08A94DFB47A68F20
    result.rtype    = 'MISC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    if (match[3]) { result.unitid = match[3]; }else{
      result.unitid =match[1];
    }
  } else if ((match = /\/reaxys\/secured\/(paging.do)(;jsessionid=([A-Za-z0-9]+))?/.exec(path)) !== null) {
    // https://www-reaxys-com.chimie.gate.inist.fr/reaxys/secured/paging.do?performed=true&action=restore
    result.rtype    = 'REF';
    result.mime     = 'MISC';
    result.title_id = match[1];
    if (match[3]) { result.unitid = match[3]; }else{
      result.unitid =match[1];
    }
  } else if ((match = /\/(xflink)/.exec(path)) !== null) {
    // http://sc.elsevier.com.chimie.gate.inist.fr/xflink?pubno=US2006%2F40881&pubdate=2006&kindcode=A1
    result.rtype = 'REF';
    result.mime  = 'MISC';
    result.title_id    = match[1];
    if (param.issn)  {
      result.print_identifier  = param.issn;
      result.online_identifier = param.issn;
    }
    if (param.doi)   { result.doi    = param.doi;   }
    if (param.coden) { result.coden  = param.coden; }
    if (param.pubno) { result.unitid = param.pubno; }
  } else if ((match = /\/reaxys\/(printing)\/reaxys_anonymous_([A-Za-z0-9_]+)\.(xls|doc|pdf)/.exec(path)) !== null) {
    // https://www-reaxys-com.chimie.gate.inist.fr/reaxys/printing/reaxys_anonymous_20131128_115334_393.xls
    result.rtype    = 'ARTICLE';
    result.mime     = match[3].toUpperCase();
    result.unitid   = match[2];
    result.title_id = match[1];
  }
  /* temporarily disabled
  /* line to add to the test file :
  // downloadmol.do;H080__1515723734110955264/RX3;MISC;MISC;
  // https://www.reaxys.com:443/reaxys/secured/downloadmol.do?fileName=083DF887DC80B547FA540D13E4AE8599/mol_images/H080__1515723734110955264/RX3
  } else if ((match = /\/reaxys\/secured\/(downloadmol.do)/.exec(path)) !== null) {
    // https://www.reaxys.com:443/reaxys/secured/downloadmol.do?
    // fileName=083DF887DC80B547FA540D13E4AE8599/mol_images/H080__1515723734110955264/RX3
    var f_match;
    result.rtype = 'MISC';
    result.mime  = 'MISC';
    if (param.fileName && (f_match = /[A-Za-z0-9_]+\/mol_images\/([A-Za-z0-9_\/]+)/.exec(param.fileName))) {
      result.unitid = f_match[1];
    }
    result.title_id = match[1];
  */

  return result;
});
