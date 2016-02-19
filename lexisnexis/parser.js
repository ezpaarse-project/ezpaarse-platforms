#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param = parsedUrl.query || {};
  var path  = parsedUrl.pathname;

  if (/\/droit\/results\/docview\/docview/.test(path)) {
    // http://www.lexisnexis.com/fr/droit/results/docview/docview.do?docLinkInd=true
    // &risb=21_T17183418923&format=GNBFULL&sort=DATE-PUBLICATION,D,H,$PSEUDOXAB,A,H,TYPE-ARTICLE,A,H
    // &startDocNo=1&resultsUrlKey=29_T17183418941&cisb=22_T17183418938&treeMax=true&treeWidth=0&csi=294776&docNo=3
    if (param['risb']) {
      result.title_id = param['risb'];
      result.unitid = param['risb'];
    }
    if (param['format']) {
      switch (param['format']) {
      case 'GNBFULL':
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
        break;
      case 'AUTRECAS':
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
        break;
      default:
        console.log('Unknown matching format : ' + param['format'] + '\n');
        break;
      }
    }
  }

  return result;
});
