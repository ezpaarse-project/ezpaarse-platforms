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

  if ((match = /^\/toc\/((nejm|catalyst)\/([a-z]+-[a-z]+|([1-9]+)\/([1-9]+)|current))$/i.exec(path)) !== null) {
    // /toc/nejm/medical-journal
    // /toc/catalyst/current
    // /toc/catalyst/2/4
    // /toc/nejm/384/22
    result.rtype  = 'TOC';
    result.mime   = 'MISC';

    if (match[2] == 'catalyst') {
      result.online_identifier = '2642-0007';
    }
    else if (match[2] == 'nejm') {
      result.print_identifier = '0028-4793';
      result.online_identifier = '1533-4406';
    }

    if (match[4]) {
      result.vol = match[4];
    }
    if (match[5]) {
      result.issue = match[5];
    }

    result.unitid = (match[3] == 'current') ? match[2] : match[1];

  } else if ((match = /^\/doi\/(pdf|full|ref|audio|abs)\/(10\.[0-9]+\/([a-z0-9._-]+))$/i.exec(path)) !== null) {
    // /doi/full/10.1056/NEJMp1501140
    // /doi/pdf/10.1056/NEJMra1403672
    // /doi/audio/10.1056/nejm_2015.372.issue-23
    // /doi/abs/10.1056/CAT.21.0025
    // /doi/full/10.1056/CAT.21.0025
    result.doi    = match[2];
    result.unitid = match[3];

    if (match[2].includes('CAT')) {
      result.online_identifier = '2642-0007';
    }
    else {
      result.print_identifier = '0028-4793';
      result.online_identifier = '1533-4406';
    }

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
      result.rtype = 'REF';
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


  } else if ((match = /^\/doi\/do_file\/(10\.[0-9]+\/([\w._-]+))\/([\w._-]+)$/i.exec(path)) !== null) {
    // /doi/do_file/10.1056/NEJMdo210603/NEJMdo210603
    result.rtype = 'ABS';
    result.mime  = 'MP3';
    result.print_identifier = '0028-4793';
    result.online_identifier = '1533-4406';
    result.doi    = match[1];
    result.unitid = match[2];

  } else if (/^\/action\/showIssueAudio$/i.test(path)) {
    // /action/showIssueAudio?a=nejm_2015.372.issue-23.summary.mp3
    // /action/showIssueAudio?a=nejm_2015.372.issue-23.summary.mp3&doi=10.1056%2Fnejm_2015.372.issue-23&issueSumary=true 
    result.rtype = 'ABS';
    result.mime  = 'MP3';
    result.doi   = param.doi;

    result.print_identifier = '0028-4793';
    result.online_identifier = '1533-4406';

    if (param.a) {
      result.unitid = param.a.replace(/(\.summary)?\.mp3$/i, '');
    } else if (param.doi) {
      result.unitid = param.doi.split('/')[1];
    }

  } else if (/^\/action\/showPowerPoint$/i.test(path)) {
    // /action/showPowerPoint?doi=10.1056/NEJMoa1411480

    result.rtype = 'REF';
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

    if (match[1].includes('CAT')) {
      result.online_identifier = '2642-0007';
    }
    else {
      result.print_identifier = '0028-4793';
      result.online_identifier = '1533-4406';
    }


  }

  return result;
});

