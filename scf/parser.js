#!/usr/bin/env node

// ##EZPAARSE
// very simple skeleton parser

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;
  var hostname   = parsedUrl.hostname;

  var match;

  if (hostname) { result.title_id = hostname.replace('www.','').replace('.org',''); }

  if ((match = /^\/larevue_som.php$/.exec(path)) !== null) {
    // http://www.lactualitechimique.org.chimie.gate.inist.fr/larevue_som.php?cle=196
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    if (param.cle) { result.unitid = param.cle; }
  } else if ((match = /^\/larevue_article.php$/.exec(path)) !== null) {
    // http://www.lactualitechimique.org.chimie.gate.inist.fr/larevue_article.php?cle=3002
    result.rtype = 'ARTICLE';
    result.mime  = 'MISC';
    if (param.cle) { result.unitid = param.cle; }
  } else if ((match = /^\/pdfsecure.php$/.exec(path)) !== null) {
    // hhttp://www.lactualitechimique.org.chimie.gate.inist.fr/pdfsecure.php
    // ?q=kwV0KuAA5KZLlfZKtCVvcXFeulZHfMIIKf4bXPKAJ7C2pm%2Bb8uO8AOAnzXPruvVdNl%2BcRbvsE7F9BvIjAF
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.unitid = 'pdfsecure';

  } else if ((match = /^\/([A-Za-z]+)$/.exec(path)) !== null) {
    // http://www.lactualitechimique.org/Electrochimie
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/numero\/([0-9]+)$/.exec(path)) !== null) {
    // http://www.lactualitechimique.org:80/numero/402
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.unitid = 'numero/' + match[1] ;

  } else if ((match = /^\/([A-Za-z\-]+)$/.exec(path)) !== null) {
    // http://www.lactualitechimique.org/Quand-la-Republique-avait-besoin-de-savants
    result.rtype = 'ABS';
    result.mime  = 'HTML';
    result.unitid =  match[1] ;

  } else if ((match = /^\/IMG\/([a-z]+)\/([0-9A-Za-z\-]+).pdf$/.exec(path)) !== null) {
    // http://www.lactualitechimique.org:80/IMG/pdf/2015-402-decembre-p13-jacquesy-hd.pdf?6238/dc117cd12caeb2395e8b1589559155b91a8ecaf8
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.unitid =  match[2] ;

  }
  return result;
});
