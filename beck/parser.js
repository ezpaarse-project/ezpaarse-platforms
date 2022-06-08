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

  if (/^\/Search\/?$/.test(path)) {
    // /Search?PAGENR=1&WORDS=spanien&RBSORT=Score&MEINBECKONLINE=False&Addfilter=spubtyp0%3Aform
    // /Search?pagenr=1&words=spanien&st=&searchid
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (path === '/' && !vpath && Object.keys(query).some((x) => x.startsWith('q'))) {
    // /?qms=1&slocal=0&page-search-location=all&q=paris&qtt=&qa=&qIdent=&qReihe=&qjv=&qjb=&page-search-location=open
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/(10\.[0-9]+\/(97[0-9]+([_-][0-9]+)?))\/[a-z0-9_.-]+$/i.exec(path)) !== null) {
    // /10.17104/9783406654015/c-h-beck-1763-2013?hitid=01&search-click
    // /10.17104/9783406654015-35/3-die-verlagsgruendung-buchhandel-in-der-provinz?page=1
    // /10.15358/9783800643158_100/1-der-zins-als-intertemporales-phaenomen?page=1

    result.rtype  = match[3] ? 'BOOK_SECTION' : 'TOC';
    result.mime   = match[3] ? 'PDF' : 'HTML';
    result.doi    = match[1];
    result.unitid = match[2];

  } else if ((match = /^\/(10\.[0-9]+\/([0-9]{4}-[0-9]{3}[0-9x]-[0-9]{4}-([0-9s-]+)))\/[a-z0-9_.-]+?(?:-(?:issue|heft)-([0-9s-]+))?$/i.exec(path)) !== null) {
    // /10.17104/0017-1417-2020-5/gnomon-volume-92-2020-issue-5
    // /10.17104/0017-1417-2020-5-43/guillaume-biard-la-representation-honorifique-dans-les-cites-grecques-aux-epoques-clas-sique-et-hellenistique-volume-92-2020-issue-5?page=1
    // /10.15358/0340-1650-2020-2-3/wist-wirtschaftswissenschaftliches-studium-volume-49-2020-issue-2-3
    // /10.15358/0340-1650-2022-2-3-43/klima-markt-und-soziales-der-klimapolitische-dreiklang-volume-51-2022-issue-2-3?page=1
    // /10.15358/0935-0381-2021-S/controlling-jahrgang-33-2021-heft-s
    // /10.15358/0935-0381-2021-S-36/purpose-in-der-praxis-insights-einer-leitbildstudie-aus-der-deutschen-wirtschaft-volume-33-2021-issue-s?page=1

    if (match[4]) {
      result.rtype = (match[4] && match[3].toLowerCase() !== match[4].toLowerCase()) ? 'ARTICLE' : 'TOC';
    } else {
      result.rtype = query.page ? 'ARTICLE' : 'TOC';
    }

    result.mime   = 'HTML';
    result.doi    = match[1];
    result.unitid = match[2];
  }

  if (path === '/' || /^\/Dokument\/?$/i.test(path)) {
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
  }

  return result;
});
