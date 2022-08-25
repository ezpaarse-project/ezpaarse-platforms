#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme NEJM - New England Journal of Medicine
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

  if ((match = /^\/toc\/([a-z]+\/([a-z]+-[a-z]+))$/i.exec(path)) !== null) {
    // /toc/nejm/medical-journal
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/doi\/(pdf|full|ref|audio|abs)\/(10\.[0-9]+\/([a-z0-9._-]+))$/i.exec(path)) !== null) {
    // /doi/full/10.1056/NEJMp1501140
    // /doi/pdf/10.1056/NEJMra1403672
    // /doi/audio/10.1056/nejm_2015.372.issue-23
    result.doi    = match[2];
    result.unitid = match[3];

    switch (match[1]) {
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'ref':
      result.rtype = 'RECORD_VIEW';
      result.mime  = 'HTML';
      break;
    case 'audio':
      result.rtype = 'ABS';
      result.mime  = 'MP3';
      break;
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    }

  } else if (/^\/action\/showIssueAudio$/i.test(path)) {
    // /action/showIssueAudio?a=nejm_2015.372.issue-23.summary.mp3
    // /action/showIssueAudio?a=nejm_2015.372.issue-23.summary.mp3&doi=10.1056%2Fnejm_2015.372.issue-23&issueSumary=true

    result.rtype = 'ABS';
    result.mime  = 'MP3';
    result.doi   = param.doi;

    if (param.a) {
      result.unitid = param.a.replace(/(\.summary)?\.mp3$/i, '');
    } else if (param.doi) {
      result.unitid = param.doi.split('/')[1];
    }

  } else if ((match = /^\/doi\/do_file\/(10\.[0-9]+\/([a-z0-9._-]+))\/([a-z0-9._-]+)$/i.exec(path)) !== null) {
    // /doi/do_file/10.1056/NEJMdo210603/NEJMdo210603
    result.rtype = 'ABS';
    result.mime  = 'MP3';

    result.doi    = match[1];
    result.unitid = match[2];
  } else if (/^\/action\/showPowerPoint$/i.test(path)) {
    // /action/showPowerPoint?doi=10.1056/NEJMoa1411480

    result.rtype = 'RECORD_VIEW';
    result.mime  = 'HTML';

    if (param.doi) {
      result.unitid = param.doi.split('/')[1];
      result.doi    = param.doi;
    }

  } else if ((match = /^\/doi\/suppl\/(10\.[0-9]+\/([a-z0-9]+))\/[a-z_]+\/([a-z0-9_]+)\.pdf$/i.exec(path)) !== null) {
    // /doi/suppl/10.1056/NEJMoa1410489/suppl_file/nejmoa1410489_appendix.pdf
    result.rtype  = 'SUPPL';
    result.mime   = 'PDF';
    result.doi    = match[1];
    result.unitid = match[3];
  }

  return result;
});

