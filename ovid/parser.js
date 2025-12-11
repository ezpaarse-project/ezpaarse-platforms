#!/usr/bin/env node
'use strict';

const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Ovid
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // Extract VisibleBody URL from proxy URLs (qurl or url parameter)
  let visibleBodyUrl = null;
  if (param.qurl) {
    try {
      visibleBodyUrl = decodeURIComponent(param.qurl);
      if (visibleBodyUrl.startsWith('r0$')) {
        visibleBodyUrl = visibleBodyUrl.substring(3);
      }
    } catch (e) {
      // ignore invalid URL encoding
    }
  } else if (param.url) {
    try {
      visibleBodyUrl = decodeURIComponent(param.url);
    } catch (e) {
      // ignore invalid URL encoding
    }
  }

  // Parse VisibleBody URL if extracted from proxy (only ovid.visiblebody.com / visiblebody.com)
  if (visibleBodyUrl) {
    try {
      const vbUrl = new URL(visibleBodyUrl);
      if (vbUrl.hostname && (vbUrl.hostname === 'ovid.visiblebody.com' || vbUrl.hostname === 'visiblebody.com')) {
        path = vbUrl.pathname;
        const vbParams = {};
        vbUrl.searchParams.forEach((value, key) => {
          vbParams[key] = value;
        });
        param = vbParams;
        // hostname check is done upstream by ezPAARSE, no need to store it
      }
    } catch (e) {
      // ignore invalid URL
    }
  }

  // VisibleBody routes (domain filtering is handled upstream by ezPAARSE)
  // Document access: /atlas_XX/app_gl/index.php or /atlas_XX with ?osptok=... ; also /proxy.php
  if ((path.includes('/atlas_') && path.includes('/app_gl/')) || path.includes('/proxy.php')) {
    if (param.osptok) {
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      result.unitid = param.osptok;
    }
  } else if (path.includes('/atlas_') && param.osptok) {
    // /atlas_21/ or /atlas_18/ with osptok parameter
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = param.osptok;
  } else if (path === '/' || path === '') {
    // Homepage
    result.rtype = 'SESSION';
    result.mime = 'HTML';
    result.unitid = '/';
  }

  if (result.rtype) {
    return result;
  }

  // Original Ovid parsing logic
  // Handle bookreader paths (BOOK_SECTION)
  if (path.includes('/bookreader/')) {
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = path;
  } else if (typeof param.AN !== 'undefined' && param.AN !== '' && param.D === 'books') {
    // ex: ...&AN=02163061%24&...&D=books...
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.unitid = param.AN;
  } else if (typeof param['Link Set'] !== 'undefined' && param['Link Set'] !== '' && param['Counter5Data'] === null) {
    // ex: ...&Link+Set=S.sh.29.30.34.48%7c1%7csl_10
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = param['Link Set'];
  } else if (typeof param.pdf_index !== 'undefined' && param.pdf_index !== '') {
    // ex: ...&pdf_index=/fs047/ovft/live/gv031/00007890/00007890-200512270-00001...
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = param.pdf_index;
  } else if (typeof param.Abstract !== 'undefined' && param.Abstract !== '') {
    // ex: ...&Abstract=S.sh.29.30.34.48%7c1%7c1
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = param.Abstract;
  } else if (typeof param['Complete Reference'] !== 'undefined' && param['Complete Reference'] !== '') {
    // ex: ...&Complete+Reference=S.sh.29.30.34.48%7c1%7c1
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = param['Complete Reference'];
  } else if ((typeof param['Book Reader'] !== 'undefined' && param['Book Reader'] !== '') ||
             (param['Counter5Data'] && param['Counter5Data'].includes('books'))) {
    // ex: ...&Book+Reader=1... or Counter5Data containing 'books'
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    if (param['FTS Book Reader Content']) {
      result.unitid = param['FTS Book Reader Content'];
    } else {
      result.unitid = param['Link Set'];
    }
  }

  return result;
});
