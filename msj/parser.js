#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Microbiology Society Journals
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
  // console.error(parsedUrl);

  let match;
  let itemid;

  if (/^\/deliver\/fulltext\/([a-z]*)\/.*?\/(.*)\.[a-z]*$/i.test(path)) {
    // http://mic.microbiologyresearch.org:80/deliver/fulltext/micro/micro.000612.zip/mic000612.pdf?itemId=/content/journal/micro/10.1099/mic.0.000612.v1&mimeType=pdf&isFastTrackArticle=true
    // http://jgv.microbiologyresearch.org:80/deliver/fulltext/jgv/jgv.001012.zip/jgv001012.html?itemId=/content/journal/jgv/10.1099/jgv.0.001012.v1&mimeType=html&fmt=ahah
    // http://mgen.microbiologyresearch.org:80/deliver/fulltext/mgen/mgen.000150.zip/000150_1.pdf?itemId=/content/suppdata/mgen/10.1099/mgen.0.000150.v1-1&mimeType=pdf&isFastTrackArticle=
    result.mime     = param.mimeType.toUpperCase();
    if ((itemid = /^\/content\/([a-z]*)\/[a-z]*\/((.*?)\/(.*))\.v/i.exec(param.itemId)) !== null) {
      result.doi    = itemid[2];
      result.unitid = itemid[4];
      if (itemid[1] === 'journal') {
        result.rtype = 'ARTICLE';
      } else if (itemid[1] === 'suppdata') {
        result.rtype = 'SUPPL';
      }
    } else if ((itemid = /^\/content\/([a-z]*)\/[a-z]*\/((.*?)\/([a-z0-9.-]*))/i.exec(param.itemId)) !== null) {
      result.doi    = itemid[2];
      result.unitid = itemid[4];
      if (itemid[1] === 'journal') {
        result.rtype = 'ARTICLE';
      } else if (itemid[1] === 'suppdata') {
        result.rtype = 'SUPPL';
      }
    }
  } else if ((match = /^\/content\/journal\/[a-z]*\/((.*)\/([a-z]*\.[0-9]*\.[0-9]*))$/i.exec(path)) !== null) {
    // http://jgv.microbiologyresearch.org:80/content/journal/jgv/10.1099/jgv.0.001012
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/content\/journal\/[a-z]*\/((.*)\/(.*))\..*?\/figures$/i.exec(path)) !== null) {
    // http://jgv.microbiologyresearch.org:80/content/journal/jgv/10.1099/jgv.0.001012.v1/figures?fmt=ahah
    result.rtype    = 'FIGURE';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if (/^\/metrics\/usage\.action$/i.test(path)) {
    // http://jmm.microbiologyresearch.org:80/metrics/usage.action?startDate=2017-11-29&endDate=2018-01-26&itemId=/content/journal/jmm/10.1099/jmm.0.000636
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    if ((itemid = /^\/content\/journal\/[a-z]*\/((.*?)\/(.*))$/i.exec(param.itemId)) !== null) {
      result.doi      = itemid[1];
      result.unitid   = itemid[3];
    }
  } else if (/^\/references\/matchedRefsForItem\.action$/i.test(path)) {
    // http://jmm.microbiologyresearch.org:80/references/matchedRefsForItem.action?itemId=/content/journal/jmm/10.1099/jmm.0.000682.v1
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    if ((itemid = /^\/content\/journal\/[a-z]*\/((.*?)\/(.*))\.v[0-9]$/i.exec(param.itemId)) !== null) {
      result.doi    = itemid[1];
      result.unitid = itemid[3];
    }
  } else if (/^\/search$/i.test(path)) {
    // http://jmm.microbiologyresearch.org:80/search?value1=virus&option1=all&option2=pub_serialIdent&value2=&operator2=AND
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/docserver\/fulltext\/([a-zA-Z0-9]+)\/([0-9]+)\/([0-9]+)\/([a-zA-Z0-9-]+).pdf$/i.exec(path)) !== null) {
    // https://www.microbiologyresearch.org/docserver/fulltext/micro/142/1/mic-142-1-57.pdf?expires=1728410770&id=id&accname=sgid026735&checksum=A71F97E62EAFB7B4D8AF5E850C5F3642
    // https://www.microbiologyresearch.org/docserver/fulltext/micro/167/6/mic001077.pdf?expires=1728410599&id=id&accname=sgid026735&checksum=B53A057F704A70B0D100F21EF49A0D13
    // https://www.microbiologyresearch.org/docserver/fulltext/mgen/8/12/mgen000863.pdf?expires=1728410431&id=id&accname=guest&checksum=B412F3CC88149DF6BF390A60B234ABBF
    // https://www.microbiologyresearch.org/docserver/fulltext/mgen/4/4/mgen000155.pdf?expires=1728410256&id=id&accname=guest&checksum=77166DCD95FCE2B04155A3AAEC9BD79A
    // https://www.microbiologyresearch.org/docserver/fulltext/jmm/53/5/JM530504.pdf?expires=1728409601&id=id&accname=sgid026735&checksum=2CC7E925C4DCAD3C11F326005D4BD8FA
    // https://www.microbiologyresearch.org/docserver/fulltext/jmm/73/10/jmm001904.pdf?expires=1728409389&id=id&accname=sgid026735&checksum=0C7FD5EA1056BFB7802CB07B0F1926B9
    // https://www.microbiologyresearch.org/docserver/fulltext/jgv/66/9/JV0660092017.pdf?expires=1728409176&id=id&accname=sgid026735&checksum=BC77D78966356F7A8CC8BB7A1FD9A1A9
    // https://www.microbiologyresearch.org/docserver/fulltext/jgv/86/11/3055.pdf?expires=1728408939&id=id&accname=sgid026735&checksum=5485D29E910E7401F3C67A5C535DD3D6
    // https://www.microbiologyresearch.org/docserver/fulltext/ijsem/47/4/ijs-47-4-958.pdf?expires=1728408677&id=id&accname=sgid026735&checksum=2D0DEAF4FA0581B2342D9228FEAEA582
    // https://www.microbiologyresearch.org/docserver/fulltext/ijsem/74/10/ijsem006531.pdf?expires=1728408462&id=id&accname=sgid026735&checksum=85825645F52F37CB6468AE80DA3AB40D
    // https://www.microbiologyresearch.org/docserver/fulltext/acmi/4/6/acmi000373.pdf?expires=1728408275&id=id&accname=sgid026735&checksum=2CC7130585FED05E416D58732AB0A793
    // https://www.microbiologyresearch.org/docserver/fulltext/acmi/2/12/acmi000176.pdf?expires=1728407942&id=id&accname=sgid026735&checksum=5CE9054435583FDEDC3371A48122C305
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.issue    = match[3];
    result.vol      = match[2];
    result.db_id    = match[1];
    result.unitid   = `${match[1]}/${match[2]}/${match[3]}/${match[4]}`;
  } else if ((match = /^\/content\/journal\/([a-zA-Z0-9]+)\/([0-9.]+)\/([a-zA-Z0-9-.]+)\/sidebyside$/i.exec(path)) !== null) {
    // https://www.microbiologyresearch.org/content/journal/micro/10.1099/mic.0.001077/sidebyside
    // https://www.microbiologyresearch.org/content/journal/mgen/10.1099/mgen.0.000863/sidebyside
    // https://www.microbiologyresearch.org/content/journal/mgen/10.1099/mgen.0.000155/sidebyside
    // https://www.microbiologyresearch.org/content/journal/jmm/10.1099/jmm.0.45551-0/sidebyside
    // https://www.microbiologyresearch.org/content/journal/jmm/10.1099/jmm.0.001904/sidebyside
    // https://www.microbiologyresearch.org/content/journal/jgv/10.1099/0022-1317-66-9-2017/sidebyside
    // https://www.microbiologyresearch.org/content/journal/jgv/10.1099/vir.0.81174-0/sidebyside
    // https://www.microbiologyresearch.org/content/journal/ijsem/10.1099/00207713-47-4-958/sidebyside
    // https://www.microbiologyresearch.org/content/journal/ijsem/10.1099/ijsem.0.006531/sidebyside
    // https://www.microbiologyresearch.org/content/journal/acmi/10.1099/acmi.0.000373/sidebyside
    // https://www.microbiologyresearch.org/content/journal/acmi/10.1099/acmi.0.000176/sidebyside
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = `${match[2]}/${match[3]}`;
    result.db_id    = match[1];
    result.unitid   = `${match[2]}/${match[3]}`;
  } else if ((match = /^\/content\/journal\/([a-zA-Z0-9]+)\/browse$/i.exec(path)) !== null) {
    // https://www.microbiologyresearch.org/content/journal/micro/browse
    // https://www.microbiologyresearch.org/content/journal/mgen/browse
    // https://www.microbiologyresearch.org/content/journal/jmm/browse
    // https://www.microbiologyresearch.org/content/journal/jgv/browse
    // https://www.microbiologyresearch.org/content/journal/ijsem/browse
    // https://www.microbiologyresearch.org/content/journal/acmi/browse
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
