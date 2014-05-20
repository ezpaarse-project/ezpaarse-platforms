#!/usr/bin/env node

// ##EZPAARSE
// very simple skeleton parser

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;
  var hostname   = parsedUrl.hostname;

  var match;

  if (hostname) { result.title_id = hostname.replace("www.","").replace(".org",""); }

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
    //if (param.q) { result.unitid = param.q; }
  }
  return result;
});
