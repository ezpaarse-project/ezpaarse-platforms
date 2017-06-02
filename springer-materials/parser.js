#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform SpringerMaterials
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  let match;

  if (/^\/search$/.test(path)) {
    // Search Examples:
    // http://materials.springer.com/search?searchTerm=&datasourceFacet=lb&substanceId=
    // http://materials.springer.com/search?searchTerm=Calcium&propertyFacet=

    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/([^\/]+)\/docs\/([^\/]+)$/.exec(path)) !== null) {
    // View Abstract Example:
    // TOC:  http://materials.springer.com/bp/docs/978-3-540-40017-2
    // HTML: http://materials.springer.com/lb/docs/sm_lbs_978-3-540-75486-2_199
    // Full: http://materials.springer.com/ads/docs/ads000340
    // http://materials.springer.com/msi/docs/sm_msi_r_20_012479_01
    // http://materials.springer.com/polymerthermodynamics/docs/athas_0062
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[2];

  } else if ((match = /^\/citation\/download\/(bib|endnote|ris)\/([^\/]+)\/(.*)$/.exec(path)) !== null) {
    // Export Citation Examples:
    // http://materials.springer.com/citation/download/bib/sm_lbs_978-3-540-75486-2_199/lbs
    // http://materials.springer.com/citation/download/endnote/sm_lbs_978-3-540-75486-2_199/lbs
    // http://materials.springer.com/citation/download/ris/sm_lbs_978-3-540-75486-2_199/lbs
    // http://materials.springer.com/citation/download/bib/ads000340/adsorption
    // http://materials.springer.com/citation/download/endnote/ads000340/adsorption
    // http://materials.springer.com/citation/download/ris/ads000340/adsorption

    result.rtype    = 'REF';
    result.unitid   = `${match[2]}.${match[1]}`;
    result.title_id = `${match[2]}.${match[1]}`;

    switch (match[1]) {
    case 'ris':
      result.mime = 'RIS';
      break;
    case 'bib':
    case 'endnote':
      result.mime = 'TEXT';
      break;
    }

  } else if ((match = /^\/assets\/([^\/]+)\/([0-9]+)\/([^\/]+)\/([^\/]+)$/.exec(path)) !== null && param.ext) {
    // Download artice, datasets, figures
    // Fulltext Access: http://materials-static.springer.com/assets/sm_lbs/675/sm_lbs_978-3-540-75486-2_199/sm_lbs_978-3-540-75486-2_199.pdf?auth66=1473939009_9faf82c0988e589da4e37661f88410a4&ext=.pdf
    // CSV: http://materials-static.springer.com/assets/sm_ads/087/ads000340/ads000340-data.csv?auth66=1473945067_658f5bc6cda84094c57fab3e1dc56bc7&ext=.csv
    // PNG Chart: http://materials-static.springer.com/assets/sm_ads/087/ads000340/ads000340-plot-large.png?auth66=1473945189_2b4f6c95653d711b9843a9521265979e&ext=.png

    result.title_id = `${match[3]}${param.ext || ''}`;
    result.unitid   = `${match[3]}${param.ext || ''}`;

    switch (param.ext) {
    case '.pdf':
      result.rtype = 'BOOK_SECTION';
      result.mime  = 'PDF';
      break;
    case '.csv':
      result.rtype = 'SUPPL';
      result.mime  = 'CSV';
      break;
    case '.png':
      result.rtype = 'IMAGE';
      result.mime  = 'MISC';
      break;
    }

  } else if ((match = /^\/tables\/([^\/]+)\/([^\/]+)$/.exec(path)) !== null) {
    // Download tables
    // http://materials.springer.com/tables/sm_ptd/athas_0011?data-table=Calculated%20Heat%20Capacity%20and%20Thermodynamic%20Functions&data-table=Experimental%20Heat%20Capacity%20(Amorphous%20Phase)&data-table=Experimental%20Heat%20Capacity%20(Crystalline%20Phase)

    result.rtype  = 'SUPPL';
    result.mime   = 'MISC';
    result.unitid = `tables-${match[2]}`;

    if (param['data-table']) {
      if (Array.isArray(param['data-table'])) {
        result.title_id = param['data-table'].join(';');
      } else {
        result.title_id = param['data-table'];
      }
    }
  } else if ((match = /^\/([^\/]+)\/phase-diagram\/docs\/([^\/]+)$/.exec(path)) !== null) {
    // View Diagrams
    // http://materials.springer.com/msi/phase-diagram/docs/sm_msi_r_20_012479_01_full_LnkDia0

    result.rtype    = 'SUPPL';
    result.mime     = 'MISC';
    result.unitid   = match[2];
    result.title_id = match[2];
  }

  return result;
});

