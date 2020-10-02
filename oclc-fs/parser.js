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
  let queryParam = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/WebZ\/FSOpenURL$/i.exec(path)) !== null) {
    //http://firstsearch.oclc.org/WebZ/FSOpenURL?database=3&dbname=WorldCat&autho=someAutho&timestamp=23&encryption=318c78ca417f949f5ec3d71c80d79b6a&oclcnum=useuetkok&isbn=9781432933890&title=Cats&aulast=Ganeri&date=2009&sessionid=0&checksum=739b6a56c9ce004708090ba02c8c59f5
    //http://firstsearch.oclc.org/WebZ/FSOpenURL?database=3&dbname=WorldCat&autho=someAutho&timestamp=1&encryption=6f4a453e7ceb71e016661caf8015fdd9&oclcnum=eeeotkttfq&isbn=9780062878342&title=Sapphire+Flames.&aulast=Andrews&date=2019&sessionid=0&checksum=5c6fc165a29b54629d9f285338eb04a3
    result.rtype = 'OPENURL';
    result.login = queryParam.autho;
    result.db_id = queryParam.dbname;
    if (queryParam.issn) {
      //http://firstsearch.oclc.org/WebZ/FSOpenURL?database=3&dbname=WorldCat&autho=someAutho&timestamp=1&encryption=bc90fbbb8e8f0b86003707fa3a3a3e5f&oclcnum=ouxxhqtqx&issn=0737-8831&atitle=Lessons+learned+from+analyzing+library+database+usage+data&aulast=Coombs&volume=23&issue=4&date=2005&sessionid=0&checksum=6418bc3c07053f9036af5d54d6557264
      result.publication_Title = queryParam.atitle;
      result.publication_date = queryParam.date;
      result.title_id = queryParam.issn;
      result.vol = queryParam.volume;
      result.num = queryParam.issue;
    } else {
      result.publication_Title = queryParam.title;
      result.publication_date = queryParam.date;
      result.title_id = queryParam.isbn;
      result.unitid = queryParam.isbn;
    }

  } else if ((match = /^\/WebZ\/([a-z]+)$/i.exec(path)) !== null) {
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
    result.login = param.sessionid;
  }

  result.platform_name = 'OCLC FirstSearch';
  result.mime  = 'HTML';

  return result;
});
