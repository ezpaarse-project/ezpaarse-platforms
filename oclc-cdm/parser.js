#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform OCLC ContentDM
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  //console.error(parsedUrl);

  let match;

  if ((match = /^\/digital\/search\/searchterm\/(.+)$/i.exec(path)) !== null) {
    // https://cdm16014.contentdm.oclc.org/digital/search/searchterm/bridge
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/digital\/collection\/([0-9a-z]+)\/search\/searchterm\/(.+)$/i.exec(path)) !== null) {
    // https://cdm16014.contentdm.oclc.org/digital/collection/p4014coll18/search/searchterm/bridge
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/digital\/collection\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // https://cdm16014.contentdm.oclc.org/digital/collection/p4014coll18
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/digital\/collection\/([0-9a-z]+)\/id\/([0-9]+)$/i.exec(path)) !== null) {
    // https://cdm16014.contentdm.oclc.org/digital/collection/p4014coll18/id/5371
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/id/' + match[2];
  } else if ((match = /^\/digital\/collection\/([0-9a-z]+)\/id\/([0-9]+)\/rec\/([0-9]+)$/i.exec(path)) !== null) {
    //https://michianamemory.sjcpl.org/digital/collection/p16827coll9/id/4938/rec/1
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/id/' + match[2] + '/rec/' + match[3];
  } else if ((match = /^\/digital\/iiif\/([0-9a-z]+)\/([0-9]+)\/full\/(.+)\/(.+)\/(.+)\.jpg$/i.exec(path)) !== null) {
    // https://cdm16014.contentdm.oclc.org/digital/iiif/p4014coll18/5371/full/full/0/default.jpg
    //https://michianamemory.sjcpl.org/digital/iiif/p16827coll1/5506/full/584,/0/default.jpg
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.unitid   = match[1] + '/' + match[2];
  } else if ((match = /^\/digital\/download\/collection\/([0-9a-z]+)\/id\/([0-9]+)\/size\/(.+)$/i.exec(path)) !== null) {
    // https://michianamemory.sjcpl.org/digital/download/collection/p16827coll5/id/1007/size/large
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.unitid   = match[1] + '/id/' + match[2];
  } else if ((match = /^\/digital\/api\/collection\/([0-9a-z]+)\/id\/([0-9]+)\/page\/([0-9]+)\/inline\/([0-9a-z_]+)$/i.exec(path)) !== null) {
    // https://michianamemory.sjcpl.org/digital/api/collection/p16827coll9/id/4940/page/11/inline/p16827coll9_4940_11
    result.rtype    = 'OTHER';
    result.mime     = 'PDF';
    result.unitid   = match[4];
  }
  result.db_id = parsedUrl.host.split('.')[0];

  return result;
});
