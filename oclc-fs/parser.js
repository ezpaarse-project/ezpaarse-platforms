#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform OCLC Firstsearch
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */


module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  //let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/WebZ\/([a-z]+)$/i.exec(path)) !== null) {
    const category = match[1].toLowerCase();
    const paramString = parsedUrl.search.substring(1);

    let param = paramString.split(':').reduce(function(obj, str, index) {
      let strParts = str.split('=');
      if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
        obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
      }
      return obj;
    }, {});


    switch (category) {
    case 'fspage': {
      // /WebZ/FSPage?pagename=expert:sessionid=fsap02pxm1-1680-kfe2rdew-sjodlg:entitypagenum=5:0
      let page = param.pagename;
      switch (page) {
      case 'home': {
        result.rtype = 'OTHER';
        break;
      }
      case 'quicksearch': {
        result.rtype = 'OTHER';
        break;
      }
      case 'search': {
        result.rtype = 'OTHER';
        break;
      }
      case 'expert': {
        result.rtype = 'OTHER';
        break;
      }
      case 'alldbs': {
        result.rtype = 'OTHER';
        break;
      }
      case 'sources': {
        result.rtype = 'OTHER';
        break;
      }
      case 'content': {
        result.rtype = 'TOC';
        break;
      }
      case 'email': {
        result.rtype = 'OTHER';
        break;
      }
      case 'holdings': {
        result.rtype = 'OTHER';
        break;
      }
      case 'stafflogin': {
        result.rtype = 'OTHER';
        break;
      }
      case 'prefs': {
        result.rtype = 'OTHER';
        break;
      }
      case 'record': {
        result.rtype = 'RECORD';
        break;
      }
      case 'directexport': {
        result.rtype = 'RECORD';
        break;
      }
      case 'history': {
        result.rtype = 'OTHER';
        break;
      }
      }
      break;
    }
    case 'fsquery': {
      result.rtype ='SEARCH';
      break;
    }
    case 'fsfetch': {
      if (param.fetchtype == 'fullrecord') {
        result.rtype ='RECORD';
      } else {
        result.rtype ='OTHER';
      }
      break;
    }
    case 'morelikethis': {
      result.rtype ='SEARCH';
      break;
    }
    case 'fsill': {
      result.rtype ='OTHER';
      break;
    }
    }
    result.platform_name = 'OCLC FirstSearch';
    result.login = param.sessionid;
    result.mime  = 'HTML';
  }


  return result;
});
