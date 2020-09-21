#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result   = {};
  let param    = parsedUrl.query || {};
  let url      = parsedUrl.href;
  let pathname = parsedUrl.pathname;

  if (param.url) {
    url = param.url;
  }
  if (param.fileId && !/\|/.exec(param.fileId)) {
    // if fileId contains some '|', ignore (pre-click to PDF)
    result.print_identifier = param.fileId.substr(1, 4) + '-' + param.fileId.substr(5, 4);
    result.unitid = param.fileId;
  }
  result.title_id = param.jid;

  let match = /\/action\/([a-z]+)/i.exec(url);

  if (match) {
    switch (match[1]) {
    case 'displayJournal':
      result.unitid = param.jid;
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      break;
    case 'displayJournalTab':
      // http://journals.cambridge.org.gate1.inist.fr/action/displayJournal?jid=VNS&bVolume=y
      result.rtype = 'TOC';
      result.mime  = 'HTML';
      break;
    case 'displayIssue':
      // http://journals.cambridge.org.gate1.inist.fr/action/displayIssue?decade=2010&jid=VNS&volumeId=27&issueId=3-4&iid=7880012
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = param.iid;
      result.volume = param.volumeId;
      result.issue  = param.issueId;
      break;
    case 'displayFulltext':
      if (param.pdftype) {
        // http://journals.cambridge.org.gate1.inist.fr/action/displayFulltext?type=1&pdftype=1&fid=7880027&jid=VNS&volumeId=27&issueId=3-4&aid=7880025
        result.unitid = param.aid;
        result.rtype  = 'ARTICLE';
        result.mime   = 'PDF';
        result.volume = param.volumeId;
        result.issue  = param.issueId;
      } else {
        // if (param.fulltextType == 'RA')
        // http://journals.cambridge.org.gate1.inist.fr/action/displayFulltext?type=6&fid=7880026&jid=VNS&volumeId=27&issueId=3-4&aid=7880025&fulltextType=RA&fileId=S0952523810000179
        if (!result.unitid) {
          result.unitid = param.aid;
        }
        result.rtype  = 'ARTICLE';
        result.mime   = 'HTML';
        result.volume = param.volumeId;
        result.issue  = param.issueId;
        if (param.fileId) {
          result.doi = '10.1017/' + param.fileId;
        }
      }
      break;
    case 'displayAbstract':
      // http://journals.cambridge.org.gate1.inist.fr/action/displayAbstract?fromPage=online&aid=9010487&fulltextType=RV&fileId=S0952523813000345
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      if (param.fileId) {
        result.doi = '10.1017/' + param.fileId;
      }
      break;
    default:
      // if nothing recognized remove jid
      result.title_id = null;
      break;
    }
  } else if ((match = /^\/core\/services\/aop-cambridge-core\/content\/view\/[a-z0-9]+\/(([SB]?[0-9]+)[a-z0-9._-]+)\.pdf\//i.exec(pathname)) !== null) {
    // /core/services/aop-cambridge-core/content/view/A95C410BA1767D60C3DA96901466AABD/S1053837209990411a.pdf/old_generation_of_economists_and_the_new_an_intellectual_historians_approach_to_a_significant_transition.pdf
    // /core/services/aop-cambridge-core/content/view/F0D934DEF58963D498415A3FA90957FA/9781316337998c8_p115-127_CBO.pdf/queer_american_gothic.pdf
    result.mime   = 'PDF';
    result.unitid = match[1];

    if (/^S/i.test(match[2])) {
      result.rtype = 'ARTICLE';
      result.pii = match[2];
    } else {
      result.rtype = 'BOOK_SECTION';
      result.online_identifier = match[2];
    }

  } else if ((match = /^\/core\/journals\/([a-z-]+)\/article\/([a-z0-9-]+)\/[a-z0-9]+(\/core-reader)?\/?$/i.exec(pathname)) !== null) {
    // /core/journals/journal-of-the-history-of-economic-thought/article/old-generation-of-economists-and-the-new-an-intellectual-historians-approach-to-a-significant-transition/A95C410BA1767D60C3DA96901466AABD/core-reader

    result.mime     = 'HTML';
    result.rtype    = match[3] ? 'ARTICLE' : 'ABS';
    result.unitid   = match[2];
    result.title_id = match[1];

  } else if ((match = /^\/core\/journals\/([a-z-]+)\/issue\/[a-z0-9]+$/i.exec(pathname)) !== null) {
    //core/journals/journal-of-the-history-of-economic-thought/issue/CF230263144D4D
    result.mime     = 'HTML';
    result.rtype    = 'TOC';
    result.unitid   = match[1] + '/issue/';
    result.title_id = match[1];

  } else if ((match = /^\/core\/books\/([a-z0-9-]+)\/[a-z0-9]+$/i.exec(pathname)) !== null) {
    // /core/books/cambridge-companion-to-american-gothic/1DB7BB56096D72ED4FBA5FEE294CBFBA
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/core\/books\/(([a-z0-9-]+)\/[a-z0-9-]+)\/[a-z0-9]+\/core-reader$/i.exec(pathname)) !== null) {
    // /core/books/cambridge-companion-to-american-gothic/queer-american-gothic/F0D934DEF58963D498415A3FA90957FA/core-reader
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
  } else {
    // if nothing recognized remove jid
    result.title_id = null;
  }

  return result;
});
