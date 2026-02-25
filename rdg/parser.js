#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Recherche Data Gouv
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
  console.error(parsedUrl);

  let match, match2;

  if ((match = /^\/dataverse\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://entrepot.recherche.data.gouv.fr/dataverse/root?q=zinc
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.db_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    // result.unitid = match[2];

  } else if ((match = /^\/dataset.xhtml$/i.exec(path)) !== null) {
    // https://entrepot.recherche.data.gouv.fr/dataset.xhtml?persistentId=doi:10.57745/TDW4KN
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    if (param.persistentId) {
      if ((match2 = /doi:([0-9.]+)\/([0-9a-zA-Z]+)$/i.exec(param.persistentId)) !== null) {
        result.doi = match2[1]+'/'+match2[2];
        result.unitid = match2[2];
      }
    }
  } else if ((match = /^\/api\/access\/datafile\/([0-9]+)$/i.exec(path)) !== null) {
    // https://entrepot.recherche.data.gouv.fr/api/access/datafile/636145?format=original&gbrecs=true
    result.rtype    = 'LINK';
    result.unitid     = match[1];
    if (param.format) {
      //console.log(param.format);
    }

  } else if ((match = /^\/api\/access\/datafiles$/i.exec(path)) !== null) {
    // https://entrepot.recherche.data.gouv.fr/api/access/datafiles?gbrecs=true&format=original
    result.rtype    = 'DATASET';
    console.log(param);
    if (param.format) {
      console.log(param.format);
      result.mime     = 'ZIP';
    }
  }

  return result;
});
