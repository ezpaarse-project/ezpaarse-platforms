#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result   = {};
  let param    = parsedUrl.query || {};
  let path     = parsedUrl.pathname;
  let hostname = parsedUrl.hostname;

  let match;

  if (hostname) { result.title_id = hostname.replace('www.', '').replace('.org', ''); }

  if (/^\/larevue_som.php$/i.test(path)) {
    // http://www.lactualitechimique.org.chimie.gate.inist.fr/larevue_som.php?cle=196
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    if (param.cle) { result.unitid = param.cle; }

  } else if (/^\/larevue_article.php$/i.test(path)) {
    // http://www.lactualitechimique.org.chimie.gate.inist.fr/larevue_article.php?cle=3002
    result.rtype = 'ARTICLE';
    result.mime  = 'MISC';
    if (param.cle) { result.unitid = param.cle; }

  } else if (/^\/pdfsecure.php$/i.test(path)) {
    // hhttp://www.lactualitechimique.org.chimie.gate.inist.fr/pdfsecure.php
    // ?q=kwV0KuAA5KZLlfZKtCVvcXFeulZHfMIIKf4bXPKAJ7C2pm%2Bb8uO8AOAnzXPruvVdNl%2BcRbvsE7F9BvIjAF
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = 'pdfsecure';

  } else if ((match = /^\/([a-z]+)$/i.exec(path)) !== null) {
    // http://www.lactualitechimique.org/Electrochimie
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/numero\/([0-9]+)$/i.exec(path)) !== null) {
    // http://www.lactualitechimique.org:80/numero/402
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
    result.unitid = 'numero/' + match[1];

  } else if ((match = /^\/([a-z-]+)$/i.exec(path)) !== null) {
    // http://www.lactualitechimique.org/Quand-la-Republique-avait-besoin-de-savants
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[1] ;

  } else if ((match = /^\/IMG\/([a-z]+)\/([0-9a-z-]+).pdf$/i.exec(path)) !== null) {
    // http://www.lactualitechimique.org:80/IMG/pdf/2015-402-decembre-p13-jacquesy-hd.pdf?6238/dc117cd12caeb2395e8b1589559155b91a8ecaf8
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[2] ;

  }
  return result;
});
