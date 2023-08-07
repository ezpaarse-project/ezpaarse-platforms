#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let params = parsedUrl.query || {};
  let match;

  if ((match = /^\/(index).jsp$/.exec(path)) !== null) {
    // http://www.arabidopsis.org.gate1.inist.fr/index.jsp
    result.unitid = match[1];
    result.mime   = 'HTML';
    result.rtype  = match[1].toUpperCase();

  } else if ((match = /^\/([^/]+)\/index.jsp$/.exec(path)) !== null) {
    // http://www.arabidopsis.org.gate1.inist.fr/tools/index.jsp
    result.unitid = match[1] + '/index';
    result.mime   = 'HTML';
    result.rtype  = match[1].toUpperCase();

  } else if (/^\/servlets\/Search$/.test(path)) {
    // http://www.arabidopsis.org.gate1.inist.fr/servlets/Search?type=general&action=new_search
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';

  } else if (/^\/servlets\/TairObject$/.test(path)) {
    // /servlets/TairObject?type=gene_class_symbol&id=1005832620
    // /servlets/TairObject?type=transposon&id=1866
    // /servlets/TairObject?type=locus&name=At1g44170
    const type = params.type || '';
    const id = params.id || params.name || '';

    result.rtype  = 'RECORD';
    result.mime   = 'HTML';
    result.unitid = `${type}/${id}`;

  } else if ((match = /^\/download_files(\/.*)$/.exec(path)) !== null) {
    // /download_files/Genes/Araport11_genome_release/Araport11_blastsets/Araport11_cds_20220914.gz
    result.rtype  = 'RECORD';
    result.mime   = 'MISC';
    result.unitid = match[1];
  }

  return result;
});

