#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 200*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var url    = parsedUrl.href;

  if (param.url) {
    url = param.url;
  }
  if (param.fileId && !/\|/.exec(param.fileId)) { // if fileId contains some '|', ignore (pre-click to PDF)
    result.print_identifier  = param.fileId.substr(1, 4) + '-' + param.fileId.substr(5, 4);
    result.unitid = param.fileId;
  }
  result.title_id = param.jid;

  var match = /\/action\/([a-zA-Z]+)/.exec(url);
  if (match) {
    switch (match[1]) {
    case 'displayJournal':
       result.unitid =param.jid;
        result.rtype = 'TOC';
      result.mime  = 'MISC';

      break;
    case 'displayJournalTab':
      // http://journals.cambridge.org.gate1.inist.fr/action/displayJournal?jid=VNS&bVolume=y
      result.rtype = 'TOC';
      result.mime  = 'MISC';

      break;
    case 'displayIssue':
      // http://journals.cambridge.org.gate1.inist.fr/action/displayIssue?decade=2010&jid=VNS&volumeId=27&issueId=3-4&iid=7880012
     
      result.rtype = 'TOC';
      result.mime  = 'MISC';
      result.unitid =param.iid;
      result.volume = param.volumeId;
      result.issue = param.issueId;
      break;
    case 'displayFulltext':
      if (param.pdftype) {
        // http://journals.cambridge.org.gate1.inist.fr/action/displayFulltext?type=1&pdftype=1&fid=7880027&jid=VNS&volumeId=27&issueId=3-4&aid=7880025
        result.unitid = param.aid;
        result.rtype  = 'ARTICLE';
        result.mime   = 'PDF';
        result.volume = param.volumeId;
        result.issue = param.issueId;
      } else  { // if (param.fulltextType == 'RA')
        // http://journals.cambridge.org.gate1.inist.fr/action/displayFulltext?type=6&fid=7880026&jid=VNS&volumeId=27&issueId=3-4&aid=7880025&fulltextType=RA&fileId=S0952523810000179
        if (!result.unitid) { result.unitid = param.aid; }
        result.rtype  = 'ARTICLE';
        result.mime   = 'HTML';
        result.volume = param.volumeId;
        result.issue = param.issueId;
        if (param.fileId) { result.doi = '10.1017/' +param.fileId; }


      }
      break;
    case 'displayAbstract':
      // http://journals.cambridge.org.gate1.inist.fr/action/displayAbstract?fromPage=online&aid=9010487&fulltextType=RV&fileId=S0952523813000345
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
      if (param.fileId) { result.doi = '10.1017/' + param.fileId;  }
      break;
    default:
      // if nothing recognized remove jid
      result.title_id = null;
      break;
    }
  } else {
    // if nothing recognized remove jid
    result.title_id = null;
  }
  return result;
});
