#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const doiPrefix = '10.35562';

/**
 * Recognizes the accesses to the platform Prairial
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

  if (parsedUrl.hostname === 'alyoda.eu') {
    if (/^\/index.php$/i.test(path)) {
      // https://alyoda.eu/index.php?id=8868#9080

      result.title_id = 'alyoda';
      result.mime = 'HTML';
      result.rtype = 'ARTICLE';

      const id = param.id;
      if (id && parsedUrl.hash) {
        result.doi = `${doiPrefix}/alyoda.${parsedUrl.hash.substring(1)}`;
      }

      if (!id) {
        result.rtype = 'TOC';
        result.mime = 'HTML';
      } else {
        const isPdf = param.do === '_pdfgen_get' || param.file;
        if (isPdf) { result.rtype = 'ARTICLE'; }
        result.mime = isPdf ? 'PDF' : 'HTML';
        result.unitid = id;
      }

    }
  }
  if (parsedUrl.hostname === 'rifrancophonies.com') {
    if ((match = /^\/index.php$/i.exec(path)) !== null) {
      // https://rifrancophonies.com/index.php?id=1442

      const id = param.id || param.document;

      result.title_id = 'rif';
      result.mime = 'HTML';
      result.rtype = 'ARTICLE';

      if (!id) {
        result.rtype = 'TOC';
        result.mime = 'HTML';
      } else {
        const isPdf = param.do === '_pdfgen_get' || param.file;
        if (isPdf) { result.rtype = 'ARTICLE'; }
        result.mime = isPdf ? 'PDF' : 'HTML';
        result.unitid = id;
      }
    }
  }
  if (parsedUrl.hostname === 'publications-prairial.fr') {
    if ((match = /^(?:\/(?!idref|prairialdoc)([a-z0-9-]+))?\/(index.php)?$/i.exec(path)) !== null) {
      // /bacaly/index.php?file=1&id=1295
      // /voix-contemporaines/?do=_pdfgen_get&document=140&lang=en
      // /voix-contemporaines/index.php?id=140

      let titleId = match[1];
      const id = param.id || param.document;

      if (!id) {
        result.rtype = 'TOC';
        result.mime = 'HTML';
      } else {
        const isPdf = param.do === '_pdfgen_get' || param.file;

        if (isPdf) { result.rtype = 'ARTICLE'; }

        result.mime = isPdf ? 'PDF' : 'HTML';
        result.title_id = titleId;
        result.unitid = `${titleId}/${id}`;
      }

      if (titleId === 'pratiques-et-formes-litteraires') {
        titleId = 'pfl';
      } else if (titleId === 'frontiere-s') {
        titleId = 'frontieres';
      }
      result.doi = `${doiPrefix}/${titleId}.${id}`;
    }
  }




  return result;
});
