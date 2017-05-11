#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 200*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param = parsedUrl.query || {};
  var url = parsedUrl.href;
  var pathname = parsedUrl.pathname;

  if (param.url) {
    url = param.url;
  }
  if (param.fileId && !/\|/.exec(param.fileId)) {
    // if fileId contains some '|', ignore (pre-click to PDF)
    result.print_identifier =
      param.fileId.substr(1, 4) + '-' + param.fileId.substr(5, 4);
    result.unitid = param.fileId;
  }
  result.title_id = param.jid;

  var match = /\/action\/([a-zA-Z]+)/.exec(url);
  if (match) {
    switch (match[1]) {
    case 'displayJournal':
      result.unitid = param.jid;
      result.rtype = 'TOC';
      result.mime = 'MISC';

      break;
    case 'displayJournalTab':
        // http://journals.cambridge.org.gate1.inist.fr/action/displayJournal?jid=VNS&bVolume=y
      result.rtype = 'TOC';
      result.mime = 'MISC';

      break;
    case 'displayIssue':
        // http://journals.cambridge.org.gate1.inist.fr/action/displayIssue?decade=2010&jid=VNS&volumeId=27&issueId=3-4&iid=7880012
      result.rtype = 'TOC';
      result.mime = 'MISC';
      result.unitid = param.iid;
      result.volume = param.volumeId;
      result.issue = param.issueId;
      break;
    case 'displayFulltext':
      if (param.pdftype) {
          // http://journals.cambridge.org.gate1.inist.fr/action/displayFulltext?type=1&pdftype=1&fid=7880027&jid=VNS&volumeId=27&issueId=3-4&aid=7880025
        result.unitid = param.aid;
        result.rtype = 'ARTICLE';
        result.mime = 'PDF';
        result.volume = param.volumeId;
        result.issue = param.issueId;
      } else {
          // if (param.fulltextType == 'RA')
          // http://journals.cambridge.org.gate1.inist.fr/action/displayFulltext?type=6&fid=7880026&jid=VNS&volumeId=27&issueId=3-4&aid=7880025&fulltextType=RA&fileId=S0952523810000179
        if (!result.unitid) {
          result.unitid = param.aid;
        }
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
        result.volume = param.volumeId;
        result.issue = param.issueId;
        if (param.fileId) {
          result.doi = '10.1017/' + param.fileId;
        }
      }
      break;
    case 'displayAbstract':
        // http://journals.cambridge.org.gate1.inist.fr/action/displayAbstract?fromPage=online&aid=9010487&fulltextType=RV&fileId=S0952523813000345
      result.rtype = 'ABS';
      result.mime = 'HTML';
      if (param.fileId) {
        result.doi = '10.1017/' + param.fileId;
      }
      break;
    default:
        // if nothing recognized remove jid
      result.title_id = null;
      break;
    }
  } else if (
    (match = /^\/core\/([a-z]+)\/([0-9a-z\-\_\.\/]+)/i.exec(pathname)) !== null) {
    //core/journals/journal-of-the-history-of-economic-thought/issue/CF230263144D4D
    //core/journals/journal-of-the-history-of-economic-thought/article/old-generation-of-economists-and-the-new-an-intellectual-historians-approach-to-a-significant-transition/A95C410BA1767D60C3DA96901466AABD/core-reader
    //core/services/aop-cambridge-core/content/view/A95C410BA1767D60C3DA96901466AABD/S1053837209990411a.pdf/old_generation_of_economists_and_the_new_an_intellectual_historians_approach_to_a_significant_transition.pdf
    let pathname_array = pathname.split('/');

    if (pathname_array[pathname_array.length - 1] == 'core-reader') {
      result.mime = 'HTML';
      result.rtype = 'ARTICLE';
      result.unitid = pathname_array[pathname_array.length - 3];
      result.title_id = pathname_array[pathname_array.length - 5];
    } else if (pathname_array[pathname_array.length - 4] == 'view') {
      result.mime = 'PDF';
      result.rtype = 'ARTICLE';

      let title_id_string = pathname_array[pathname_array.length - 2];

      result.unitid = /([a-z][0-9]+)/i.exec(title_id_string)[0]; //remove 'a.pdf' in this case
      result.pii = result.unitid;
    }

    if (pathname_array[pathname_array.length - 2] == 'issue') {
      result.mime = 'MISC';
      result.rtype = 'TOC';
      result.title_id = pathname_array[pathname_array.length - 3];
      result.unitid =pathname_array[pathname_array.length - 3] + '/' + pathname_array[pathname_array.length - 2] + '/';
    }
  } else {
    // if nothing recognized remove jid
    result.title_id = null;
  }
  return result;
});
