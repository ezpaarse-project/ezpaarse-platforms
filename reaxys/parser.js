#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  const result = {};
  const param  = parsedUrl.query || {};
  const path   = decodeURIComponent(parsedUrl.pathname).replace(/"/g, '');

  let match;

  if ((match = /^\/reaxys\/secured\/search.do(;jsessionid=[a-z0-9]+)?$/i.exec(path)) !== null) {
    // /reaxys/secured/search.do;jsessionid=863534A86F402E0CFB72AD9548BDF7D2

    if (match[1]) {
      result.rtype = 'SESSION';
      result.mime  = 'MISC';
    } else {
      result.rtype = 'QUESTION';
      result.mime  = 'MISC';
    }

  } else if (/^\/reaxys\/secured\/paging.do(;jsessionid=[a-z0-9]+)?$/i.test(path)) {
    // /reaxys/secured/paging.do?ajax=true&performed=true&size=1&searchName=H044_4115296650168273587&action=gotopage&workflowId=1451660439381&workflowStep=1&page=1&tabContextIndex=2&tabContext=substances&pageSize=9&changeMultiplier=1&multiplier=1
    result.rtype = 'QUESTION';
    result.mime  = 'MISC';

  } else if (/^\/xflink$/i.test(path)) {
    // /xflink?aulast=Heffernan&title=Chemical%20Communications&volume=49&issue=23&spage=2314&date=2013&coden=CHCOF&doi=10.1039%2Fc3cc00273j&issn=1364-548X

    result.rtype = 'LINK';
    result.mime  = 'MISC';

    for (const prop in param) {
      switch (prop) {
      case 'datetime':
      case 'timestamp':
        break;
      case 'title':
        result.publication_title = param[prop];
        break;
      case 'volume':
        result.vol = param[prop];
        break;
      case 'spage':
        result.first_page = param[prop];
        break;
      case 'epage':
        result.last_page = param[prop];
        break;
      case 'date':
        result.publication_date = param[prop];
        break;
      case 'issn':
        result.online_identifier = param[prop];
        break;
      default:
        result[prop] = param[prop];
      }
    }

  } else if ((match = /^\/reaxys\/printing\/reaxys_anonymous_([a-z0-9_]+)\.(xls|doc|pdf)$/i.exec(path)) !== null) {
    // /reaxys/printing/reaxys_anonymous_20160201_111402_168.xls

    result.rtype  = 'ARTICLE';
    result.mime   = match[2].toUpperCase();
    result.unitid = match[1];

  }
  /* temporarily disabled
  /* line to add to the test file :
  // downloadmol.do;H080__1515723734110955264/RX3;MISC;MISC;
  // https://www.reaxys.com:443/reaxys/secured/downloadmol.do?fileName=083DF887DC80B547FA540D13E4AE8599/mol_images/H080__1515723734110955264/RX3
  } else if ((match = /\/reaxys\/secured\/(downloadmol.do)/.exec(path)) !== null) {
    // https://www.reaxys.com:443/reaxys/secured/downloadmol.do?
    // fileName=083DF887DC80B547FA540D13E4AE8599/mol_images/H080__1515723734110955264/RX3
    const f_match;
    result.rtype = 'MISC';
    result.mime  = 'MISC';
    if (param.fileName && (f_match = /[A-Za-z0-9_]+\/mol_images\/([A-Za-z0-9_\/]+)/.exec(param.fileName))) {
      result.unitid = f_match[1];
    }
    result.title_id = match[1];
  */

  return result;
});
