#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Istex
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  let sid = result.sid = ec.sid || param.sid || 'none';

  if (sid.startsWith('"') && sid.endsWith('"')) {
    result.sid = sid.slice(1, -1);
  }

  if (param.q || param.q_id) {
    const size = Number.parseInt(param.size, 10);
    if (size === 0) { return {}; }

    if (param.extract) {
      result.rtype = 'METADATA_BUNDLE';
      result.mime = 'ZIP';
      result.istex_bundle_size = size;
    } else if (sid === 'istex-dl') {
      // Queries from istex-dl without "extract" should be ignored
      return {};
    } else {
      result.istex_rtype = 'QUERY';
      result.rtype = 'QUERY';
      result.mime = 'JSON';
    }
  } else if ((match = /^\/(?:document\/([0-9a-z]{40})|(ark:\/[0-9]+\/[0-9a-z-]+))\/([a-z]+)[/.]([a-z]+)\/?/i.exec(path)) !== null) {
    // /document/4C46BB8FC3AE3CB005C44243414E9D0E9C8C6057/enrichments/catWos
    // /document/55420CDEEA0F6538E215A511C72E2E5E57570138/fulltext/original
    // /document/55420CDEEA0F6538E215A511C72E2E5E57570138/metadata/xml

    result.unitid = match[1] || match[2];
    result.istex_rtype = match[3];
    result.istex_bundle_size = 1;

    if (match[2]) {
      result.ark = match[2];
    }

    switch (match[4]) {
    case 'txt':
      result.mime = 'TEXT';
      break;
    case 'mrc':
      result.mime = 'MARC';
      break;
    case 'catWos':
    case 'refBib':
    case 'refbib':
      result.mime = 'TEI';
      break;
    case 'original':
      result.mime = match[3] == 'metadata' ? 'XML' : 'PDF';
      break;
    default:
      result.mime = match[4].toUpperCase();
    }

  } else if ((match = /^\/(?:document\/([0-9a-z]{40})|(ark:\/[0-9]+\/[0-9a-z-]+))[/.]([a-z]+)\/?/i.exec(path)) !== null) {
    // /document/4C46BB8FC3AE3CB005C44243414E9D0E9C8C6057/enrichments/

    result.istex_rtype = 'OTHER';

    result.rtype  = 'OTHER';
    result.mime   = 'JSON';
    result.unitid = match[1] || match[2];

    result.istex_bundle_size = 1;

    if (match[2]) {
      result.ark = match[2];
    }

  } else if ((match = /^\/(?:document\/([0-9a-z]{40})|(ark:\/[0-9]+\/[0-9a-z-]+))\/?$/i.exec(path)) !== null) {
    // /document/5A30D5425B4E7A7A84075A5B2785BBA02FAFA3FC

    result.istex_rtype = 'metadata';

    result.mime   = 'JSON';
    result.unitid = match[1] || match[2];

    result.istex_bundle_size = 1;

    if (match[2]) {
      result.ark = match[2];
    }

  } else if (/^\/document\/openurl$/i.test(path)) {
    result.rtype = 'OPENURL';
    result.mime  = 'MISC';

    for (const p in param) {
      const value = param[p];

      if (!value) { continue; }

      switch (p) {
      case 'rft_id':
      case 'rft_pii':
      case 'rft_pmid': {
        const idMatch = /^info:(doi|pii|pmid)\/(.+)/i.exec(value);

        if (idMatch) {
          result[idMatch[1]] = idMatch[2];
        }
        break;
      }
      case 'rft.atitle':
      case 'rft.jtitle':
      case 'rft.btitle':
        result.publication_title = value;
        break;
      case 'rft.issn':
      case 'rft.isbn':
        result.print_identifier = value;
        break;
      case 'rft.eissn':
      case 'rft.eisbn':
        result.online_identifier = value;
        break;
      case 'rft.date':
        result.publication_date = value;
        break;
      case 'rft.volume':
        result.vol = value;
        break;
      case 'rft.issue':
        result.issue = value;
        break;
      case 'rft.spage':
        result.first_page = value;
        break;
      case 'rft.epage':
        result.last_page = value;
        break;
      default:
        if (p.startsWith('rft')) {
          result[p] = value;
        }
      }
    }
  }

  return result;
});

