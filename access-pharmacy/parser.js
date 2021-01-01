#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Access Medicine
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};
  // use console.error for debuging
  //console.error(parsedUrl);

  let match;

  if ((match = /^\/searchresults\.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/searchresults.aspx?q=motrin
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/patientEdHandouts\.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/patientEdHandouts.aspx?gbosID=356307
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.gbosID;
  } else if ((match = /^\/mgh\/content_public\/gboscontainer\/[0-9]+\/([0-9a-z_]+)\.pdf$/i.exec(path)) !== null) {
    // https://mgh.silverchair-cdn.com/mgh/content_public/gboscontainer/123/pa_mecramsv_hhg_spa.pdf?Expires=1608160901&Signature=NYn~wN0QcIA7S-wPu0ZbkVYy5fpHaIj~DqP9s6KtQ3Id0RTjx7xuPfLZt2IARSJElsdGfOYksNxdX83AunvjZ50e1XXsrKwCcuKXGnAsi5JXCqxgQKiUJ70sJGZc3n2LiQmOEm2S1sqvU4qTGokDCPW~GY23fSqD7h6EHF2Qi9tqjB8yJxCZaKnEEa3u0XLaMWqGXgw4~cY5ASHp1ZG3u20vvUb-FHc2w4AF~rfDSdhkRwC2Lio4YBeLf~1sVfcbISK~vhRqwLKEw1KXwG3CWBmspEqHauZUcij78lSbi1ANJwMk5~JfZwBqAW9vkkW9LXeIdi4MOTzG25kSSyV5uw__&Key-Pair-Id=APKAIE5G5CRDK6RD3PGA
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if ((match = /^\/book.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/book.aspx?bookid=2868
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.bookid;
  } else if ((match = /^\/content.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/content.aspx?bookid=1731&sectionid=116669137
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = param.bookid + '-' + param.sectionid;
  } else if ((match = /^\/MultimediaPlayer.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/MultimediaPlayer.aspx?MultimediaID=13551243
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.unitid   = param.MultimediaID;
  } else if ((match = /^\/herbsandsupplements.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/herbsandsupplements.aspx?letter=t&gbosid=381766&sectionid=223472100
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.gbosid;
  } else if ((match = /^\/ViewLarge.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/ViewLarge.aspx?figid=248154789
    result.rtype    = 'TABLE';
    result.mime     = 'HTML';
    result.unitid   = param.figid;
  }

  return result;
});

