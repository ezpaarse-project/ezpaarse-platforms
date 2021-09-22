#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const cat2rtype = new Map([
  ['komm', 'BOOK_SECTION'],
  ['zeits', 'ARTICLE'],
  ['ents', 'JURISPRUDENCE']
]);

/**
 * Recognizes the accesses to the platform Beck Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const query  = parsedUrl.query || {};
  const vpath  = query.vpath;
  let match;

  if (path !== '/' && !/^\/Dokument\/?$/i.test(path)) {
    return result;
  }

  if ((match = /^\/?bibdata\/.*?\/([a-z0-9_.-]+)\.(?:name)?Inhaltsverzeichnis\.html?$/i.exec(vpath)) !== null) {
    // /Dokument?vpath=bibdata/komm/OetkerKoHGB_7/cont/OetkerKoHGB.Inhaltsverzeichnis.htm&anchor=Y-400-W-OETKERKOHGB&opustitle=Oetker
    // /Dokument?vpath=/bibdata/zeits/njw/2021/cont/njw.2021.h30.nameinhaltsverzeichnis.htm&opusTitle=NJW
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/?bibdata\/(komm|zeits|ents)\/.*?\/cont\/([a-z0-9_.-]+)\.html?$/i.exec(vpath)) !== null) {
    // /Dokument?vpath=bibdata/ents/beckverf/eugh/cont/beckverf.eugh.vf94158734.htm
    // /?vpath=bibdata/zeits/NJW/2021/cont/NJW.2021.2145.1.htm
    // /?vpath=bibdata/komm/BattisKoBBG_5/bbg/cont/BattisKoBBG.bbg.p1.gl1.htm

    result.mime   = 'HTML';
    result.unitid = match[2];
    result.rtype  = cat2rtype.get(match[1].toLowerCase());
  }

  return result;
});
