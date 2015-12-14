#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /\/toc\/(([a-zA-Z]+)\/[0-9]+\/[0-9]+)$/.exec(path)) !== null) {
    // http://www.bioone.org.gate1.inist.fr/toc/ambi/40/8
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.title_id = match[2];
    result.unitid = match[1];
  } else if ((match = /\/doi\/abs\/(([0-9\.]+)\/([^\/\()]+))$/.exec(path)) !== null) {
    // http://www.bioone.org.gate1.inist.fr/doi/abs/10.1007/s13280-011-0207-8
    result.rtype = 'ABS';
    result.mime  = 'HTML';

    result.unitid = match[3];
    result.doi = match[1];
  } else if ((match = /\/doi\/abs\/([0-9\.]+)\/(([0-9]{4}\-[0-9]{3}([0-9Xx])?)\([0-9]+\)([^\/)]+))$/.exec(path)) !== null) {
    // http://www.bioone.org/doi/abs/10.2193/0091-7648%282006%2934%5B1368%3AAEMECR%5D2.0.CO%3B2
    result.rtype = 'ABS';
    result.mime  = 'HTML';
    result.print_identifier = match[3];
    result.unitid = match[2];
    result.doi = match[1] + '/'+ match[2];
  } else if ((match = /\/doi\/full\/([0-9\.]+)\/(([0-9]{4}\-[0-9]{3}([0-9Xx])?)\([0-9]+\)([^\/)]+))$/.exec(path)) !== null) {
    // http://www.bioone.org.gate1.inist.fr/doi/full/10.1658/1402-2001%282007%2910%5B3%3AADSOFO%5D2.0.CO%3B2
  
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.print_identifier = match[3];
    result.doi = match[1] + '/'+ match[2];
    result.unitid= match[2];

  } else if ((match = /\/doi\/full\/([0-9\.]+)\/(([^\.]+.[^\.]+.[^\.]+))$/.exec(path)) !== null) {
    // http://www.bioone.org/doi/full/10.2326/osj.12.35
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[2].split('.')[0];
    result.doi = match[1]+ '/'+ match[2];
    result.unitid =  match[2];
  } else if ((match = /\/doi\/full\/([0-9\.]+)\/((j.([0-9]{4}\-[0-9]{3}([0-9Xx])?)\.[^\/)]+))$/.exec(path)) !== null) {
    // http://www.bioone.org/doi/full/10.1111/j.1550-7408.2003.tb00099.x
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.print_identifier = match[4];
    result.doi= match[1] + '/'+ match[2];
    result.unitid = match[2];
  } else if ((match = /\/doi\/suppl\/([0-9\.]+)\/([^\/\-)]+)$/.exec(path)) !== null) {
    // http://www.bioone.org.gate1.inist.fr/doi/suppl/10.2108/zsj.30.901
    result.rtype = 'SUPPL';
    result.mime  = 'MISC';
    result.title_id = match[2].split('.')[0];
    result.doi = match[1]+ '/'+ match[2];
    result.unitid =  match[2];
  } else if ((match = /\/doi\/suppl\/([0-9\.]+)\/((j.([0-9]{4}\-[0-9]{3}([0-9Xx])?)\.[^\/)]+))$/.exec(path)) !== null) {
    // http://www.bioone.org/doi/suppl/10.1111/j.1550-7408.2003.tb00099.x
    result.rtype = 'SUPPL';
    result.mime  = 'MISC';
    result.print_identifier = match[4];
    result.doi =  match[1] + '/'+ match[2];
    result.unitid =  match[2];
  } else if ((match = /\/doi\/pdf\/(([0-9\.]+)\/(j.([0-9]{4}\-[0-9]{3}([0-9Xx])?)\.[^\/)]+))$/.exec(path)) !== null) {
    // http://www.bioone.org.gate1.inist.fr/doi/pdf/10.1637/j.0005-2086(2002)046[0025%3ASESEBI]2.0.CO%3B2
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.print_identifier = match[4];
    result.doi = match[1];
    result.unitid = match[3];
  } else if ((match = /\/doi\/pdf\/([0-9\.]+)\/(([0-9]{4}\-[0-9]{3}([0-9Xx])?)\([0-9]+\)([^\/)]+))$/.exec(path)) !== null) {
    // http://www.bioone.org/doi/pdf/10.1637/0005-2086(2002)046[0025%3ASESEBI]2.0.CO%3B2
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.print_identifier = match[3];
    result.doi = match[1] + '/' + match[2];
    result.unitid =  match[2];
  } else if ((match = /\/doi\/pdf\/([0-9\.]+)\/([^\/\()]+)$/.exec(path)) !== null) {
    // http://www.bioone.org/doi/pdf/10.1007/s11627-008-9148-8
   
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[2].split('-')[0];
    result.doi = match[1] + '/'+ match[2];
    result.unitid = match[2];
  }
  return result;
});

