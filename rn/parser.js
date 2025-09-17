#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Retronews
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let hash = parsedUrl.hash;

  let match;

  if ((match = /^\/journal\/([a-z-]+)\/([a-z0-9-]+)\/([0-9/]+)\/[a-z0-9-]+/i.exec(path)) !== null) {
    // /journal/journal-du-cher/03-juillet-1819/1/94cff93b-1644-4e4f-a55f-0e3efe894b81?search_text=+
    result.mime = 'HTML';
    result.rtype = 'ARTICLE';
    result.publication_date = match[2];
    result.unitid = `${match[1]}/${match[2]}/${match[3]}/`;
  }


  if ((match = /^\/journal\/([a-z-]+)\/([a-z0-9-]+)\/([0-9/]+)$/i.exec(path)) !== null) {
    // http://www.retronews.fr.inshs.bib.cnrs.fr/journal/l-echo-de-paris/9-mai-1906/120/615281/2
    result.mime = 'HTML';
    result.rtype = 'PREVIEW';
    result.title_id = match[1];
    result.publication_date = match[2];
    result.unitid = match[3];
  }


  if ((match = /^\/reader\/([0-9/]+)/i.exec(path)) !== null) {
    // http://www.retronews.fr.inshs.bib.cnrs.fr/reader/40/343297/3
    result.mime = 'HTML';
    result.rtype = 'PREVIEW';
    result.unitid = match[1];
  }

  if ((match = /^\/search/i.exec(path)) !== null) {
    // http://www.retronews.fr.inshs.bib.cnrs.fr/search#sort=score&publishedStart=1931-03-03&publishedEnd=1931-03-03&documentType=page&page=1
    if (hash) {
      result.mime = 'MISC';
      result.rtype = 'SEARCH';
    } else {
      // /search?page=1&q=eyJzZWFyY2giOnsidHlwZSI6InNpbXBsZSIsImNyaXRlcmlhIjp7InNlYXJjaFRleHQiOiJoaXJvc2hpbWEiLCJzZWxlY3RlZEZhY2V0cyI6eyJkYXRlIjp7fSwibG9jYXRpb24iOnsic2l6ZSI6NX0sIm9yZ2FuaXphdGlvbiI6eyJzaXplIjo1fSwicGVyc29uIjp7InNpemUiOjV9LCJwdWJsaWNhdGlvbklkIjp7fSwicHVibGljYXRpb25Mb2NhdGlvbiI6eyJzaXplIjo1fSwid29ya0lkIjp7InNpemUiOjV9LCJ0aGVtYXRpYyI6e319fSwicGFnZSI6MX19
      result.rtype = 'SEARCH';
      result.mime = 'HTML';
    }
  }

  if ((match = /^\/(edito|actualite|dossier)\/([a-z0-9-]+)/i.exec(path)) !== null) {
    // http://www.retronews.fr.inshs.bib.cnrs.fr/edito/et-lelection-presidentielle-devint-un-evenement-mediatique
    // http://www.retronews.fr.inshs.bib.cnrs.fr/dossier/lexposition-coloniale-de-1931
    // http://www.retronews.fr.inshs.bib.cnrs.fr/actualite/le-deuxieme-plus-jeune-president-de-lhistoire
    result.mime = 'MISC';
    result.rtype = 'TOC';
    result.unitid = match[2];
  }
  if ((match = /^\/thematique\/([0-9a-z-]+)\/([0-9]+)/i.exec(path)) !== null) {
    // http://www.retronews.fr.inshs.bib.cnrs.fr/thematique/histoire-de-la-presse/1368
    result.mime = 'MISC';
    result.rtype = 'TOC';
    result.title_id = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/titres-de-presse\/([0-9a-z-]+)/i.exec(path)) !== null) {
    // /titres-de-presse/journal-du-cher
    result.mime = 'HTML';
    result.rtype = 'ISSUE';
    result.unitid = match[1];
  }

  return result;
});
