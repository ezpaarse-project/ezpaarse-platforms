#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var url    = parsedUrl.href;
  var domain = parsedUrl.hostname;
  result.title_id = domain;

  var match;
  // if a param url is here, take it, else it's the path
  if (param.url) {
    url = param.url;
  }
  //console.log(url);
  if (param.option && param.option == 'com_journals') {
    // example : http://publications.edpsciences.org.gate1.inist.fr/index.php?option=com_journals
    result.rtype = 'TOC';
    result.mime = 'MISC';
    result.unitid = param.option;
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/abs\/([0-9]{4}\/[0-9]{2}|first)\/contents\/contents.html$/.exec(url)) !== null) {
    // example : http://www.apidologie.org/index.php?option=com_toc&url=/articles/apido/abs/2010/06/contents/contents.html
    result.unitid = match[1] + '/'  + match[2];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/(abs|full_html|ref)\/([0-9]{4}\/[0-9]{2}|first)(\/[a-z0-9\-]+)(\/[a-z0-9\-]+)?\/[a-z0-9A-Z\-]+.html$/.exec(url)) !== null) {
    switch (match[2]) {
    case 'abs':
      // example : http://www.apidologie.org/index.php?option=com_article&url=/articles/apido/abs/2010/06/m08176/m08176.html
      result.unitid = match[1] + '/'  + match[3] + match[4];
      result.rtype = 'ABS';
      result.mime = 'MISC';
      break;
    case 'full_html':
      // example : http://www.apidologie.org/index.php?option=com_article&url=/articles/apido/full_html/2010/06/m08176/m08176.html
      // http://www.medecinesciences.org:80/articles/medsci/full_html/2013/09/medsci2013298-9p765/F2.html
      result.unitid = match[1] + '/'  + match[3] + match[4];
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      break;
    case 'ref':
      // example http://www.apidologie.org/index.php?option=com_article&url=/articles/apido/ref/2010/06/m09075/m09075.html
      result.unitid = match[1] + '/'  + match[3] + match[4];
      result.rtype = 'REF';
      result.mime = 'MISC';
      break;
    }
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/pdf\/([0-9]{4}\/[0-9]{2}|first)(\/[a-z0-9\-]+).pdf$/.exec(url)) !== null) {
    // example : http://www.apidologie.org/articles/apido/pdf/2010/06/m08176.pdf
    result.unitid = match[1] + '/' + match[2] + match[3];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else if ((match = /\/articles\/([a-zA-Z0-9]+)\/pdf\/([0-9]{4}\/[0-9]{2}|first)(\/[a-z0-9\-]+).pdf$/.exec(url)) !== null) {
    // example : http://www.apidologie.org/articles/apido/pdf/2010/06/m08176.pdf
    result.unitid = match[1] + '/' + match[2] + match[3];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else {
    if ((match = /\/action\/([a-zA-Z]+)/.exec(url)) !== null) {
      switch (match[1]) {
      case 'displayJournal':
        // example : http://www.epjap.org/action/displayJournal?jid=JAP
        result.unitid = param.jid;
        result.rtype = 'TOC';
        result.mime = 'MISC';
        break;
      case 'displayFulltext':
        if (param.pdftype) {
          // example : http://www.epjap.org/action/displayFulltext?type=1&pdftype=1&fid=8820898&jid=JAP&volumeId=61&issueId=01&aid=8820896
          if (param.aid) { result.unitid = param.aid; }
          result.rtype = 'ARTICLE';
          result.mime = 'PDF';
        } else {
          // example : http://www.epjap.org/action/displayFulltext?type=8&fid=8820897&jid=JAP&volumeId=61&issueId=01&aid=8820896
          if (param.aid) { result.unitid = param.aid; }
          result.rtype = 'REF';
          result.mime = 'MISC';
        }
        break;
      case 'displayAbstract':
        // example : http://www.epjap.org/action/displayAbstract?fromPage=online&aid=8820896&fulltextType=RA&fileId=S1286004212303182
        if (param.aid) { result.unitid = param.aid; }
        result.rtype = 'ABS';
        result.mime = 'MISC';
        if (param.fileId) {
          result.print_identifier = param.fileId.substr(1, 4) + '-' + param.fileId.substr(5, 4);
        }
        break;
      default:
        // if nothing recognized remove domain
        result.title_id = null;
        break;
      }

    } else {
      // if nothing recognized remove domain
      result.title_id = null;
    }
  }
  return result;
});
