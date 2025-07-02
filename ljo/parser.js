#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Les Jours
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if (/^\/recherche\/?$/i.test(path)) {
    // https://lesjours.fr/recherche/?query=trump
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/obsessions\/?$/i.test(path)) {
    // https://lesjours.fr/obsessions/
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = 'obsessions';

  } else if ((match = /^\/obsessions\/([a-z0-9_.-]+\/[a-z0-9_.-]+)\/?$/i.exec(path)) !== null) {
    // https://lesjours.fr/obsessions/la-fete-du-stream-6/ep1-bonnes-feuilles-pelly/
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/ressources\/podcast\/([a-z0-9_.-]+\/[a-z0-9_.-]+)\.(weba|m4a)$/i.exec(path)) !== null) {
    // https://lesjours.fr/ressources/podcast/ep1-contexte-agro-refuseurs/ep1-refuseurs-def.m4a
    // https://lesjours.fr/ressources/podcast/ep1-procedure-changement-nom/ep1-nom-des-gensokok.weba
    result.rtype  = 'AUDIO';
    result.mime   = 'MP3';
    result.unitid = match[1];
  }

  return result;
});
