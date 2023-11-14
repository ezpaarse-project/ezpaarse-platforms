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

  if (ec.domain === 'alyoda.eu') {
    if (/^\/index.php$/i.test(path)) {
      // https://alyoda.eu/index.php?id=8868#9080

      result.title_id = 'alyoda';
      result.mime = 'HTML';
      result.rtype = 'ARTICLE';

      let id = param.id;
      id = Number.parseInt(id, 10);
      if (id && parsedUrl.hash) {
        let hash = parsedUrl.hash.substring(1);
        hash = Number.parseInt(hash, 10);
        if (!Number.isNaN(hash)) {
          result.doi = `${doiPrefix}/alyoda.${hash}`;
        }
      }

      if (Number.isNaN(id)) {
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
  if (ec.domain === 'rifrancophonies.com') {
    if ((match = /^(?:\/(?!idref|prairialdoc)([a-z0-9-]+))?\/(index.php)?$/i.exec(path)) !== null) {
      // https://rifrancophonies.com/index.php?id=1442

      let id = param.id || param.document;
      id = Number.parseInt(id, 10);

      result.title_id = match[1] || 'rif';
      result.mime = 'HTML';
      result.rtype = 'ARTICLE';

      if (Number.isNaN(id)) {
        result.rtype = 'TOC';
        result.mime = 'HTML';
      } else {
        const isPdf = param.do === '_pdfgen_get' || param.file;

        if (isPdf) { result.rtype = 'ARTICLE'; }

        result.mime = isPdf ? 'PDF' : 'HTML';
        result.unitid = id;
        result.doi = `${doiPrefix}/${result.title_id}.${id}`;
      }
    }
  }
  if (ec.domain === 'publications-prairial.fr') {
    if ((match = /^\/(?!idref|prairialdoc)([a-z0-9-]+)\/(index.php)?$/i.exec(path)) !== null) {
      // /bacaly/index.php?file=1&id=1295
      // /voix-contemporaines/?do=_pdfgen_get&document=140&lang=en
      // /voix-contemporaines/index.php?id=140

      let titleId = match[1];
      let id = param.id || param.document;
      id = Number.parseInt(id, 10);

      if (titleId === 'pratiques-et-formes-litteraires') {
        titleId = 'pfl';
      } else if (titleId === 'frontiere-s') {
        titleId = 'frontieres';
      }

      if (Number.isNaN(id)) {
        result.rtype = 'TOC';
        result.mime = 'HTML';
      } else {
        const isPdf = param.do === '_pdfgen_get' || param.file;

        if (isPdf) { result.rtype = 'ARTICLE'; }

        result.mime = isPdf ? 'PDF' : 'HTML';
        result.title_id = titleId;
        result.unitid = `${titleId}/${id}`;
        result.doi = `${doiPrefix}/${titleId}.${id}`;
      }
    }
  }

  return result;
});
