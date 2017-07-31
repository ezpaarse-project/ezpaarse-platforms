#!/usr/bin/env node

'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Engineering Village
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/search\/doc\/abstract\.url$/i.exec(path)) !== null) {
    //https://www.engineeringvillage.com/search/doc/abstract.url?pageType=quickSearch&usageOrigin=searchresults&usageZone=resultslist&searchtype=Quick&SEARCHID=916e7440M6f42M4de3M829cMbb314354be0a&DOCINDEX=1&database=1&format=quickSearchAbstractFormat&dedupResultCount=&SEARCHID=916e7440M6f42M4de3M829cMbb314354be0a&referer=%2Fsearch%2Fresults%2Fquick.url	
    result.unitid = param.SEARCHID[1] + "-" + param.DOCINDEX;
    result.rtype    = 'ABS';
    result.mime     = 'HTML';    
  } else if ((match = /^\/search\/doc\/detailed\.url$/i.exec(path)) !== null) {
    //https://www.engineeringvillage.com/search/doc/detailed.url?SEARCHID=916e7440M6f42M4de3M829cMbb314354be0a&DOCINDEX=1&database=1&pageType=quickSearch&searchtype=Quick&dedupResultCount=&format=quickSearchDetailedFormat&usageOrigin=recordpage&usageZone=abstracttab 
    result.unitid = param.SEARCHID + "-" + param.DOCINDEX;
	  result.rtype    = 'ABS';
	  result.mime     = 'HTML';	  
  } else if ((match = /^\/search\/results\/preview\.url$/i.exec(path)) !== null) {
    //https://www.engineeringvillage.com/search/results/preview.url?pageType=quickSearch&searchtype=Quick&SEARCHID=1cb32f32Mdc0dM4f70Mb494M7525b8ba03fa&DOCINDEX=3&pageType=quickSearch&searchtype=Quick&SEARCHID=1cb32f32Mdc0dM4f70Mb494M7525b8ba03fa&DOCINDEX=3&docId=cpx_4d266e4c147b1a078f6M727b10178163125&database=1&referer=%2Fsearch%2Fresults%2Fquick.url&docIndex=3&usageOrigin=searchresults&usageZone=resultslist&angularReq=true&query=%20(($computer)%20WN%20ALL)%20AND%20(1969-2017%20WN%20YR)&_=1490186863728 
    result.unitid = param.docId;
    result.rtype    = 'PREVIEW';
    result.mime     = 'HTML';
  }else if ((match = /^\/delivery\/download\/submit\.url$/i.exec(path)) !== null) {
    //https://www.engineeringvillage.com/delivery/download/submit.url?usageZone=oneclick&usageOrigin=recordpage&downloadformat=excel&filenameprefix=Engineering_Village&&sessionid=3ee6d34bMe287M4763M8c18Mf979002374be%3Ai-066b4e539b2a5cf54&database=1&docidlist=cpx_7bbc484014a175f41b3M5d3110178163125&handlelist=0&displayformat=detailed
    //https://www.engineeringvillage.com/delivery/download/submit.url?usageZone=oneclick&usageOrigin=recordpage&downloadformat=pdf&filenameprefix=Engineering_Village&&sessionid=3ee6d34bMe287M4763M8c18Mf979002374be%3Ai-066b4e539b2a5cf54&database=1&docidlist=cpx_7bbc484014a175f41b3M5d3110178163125&handlelist=0&displayformat=detailed 
    //https://www.engineeringvillage.com/delivery/download/submit.url?usageZone=oneclick&usageOrigin=recordpage&downloadformat=ascii&filenameprefix=Engineering_Village&&sessionid=3ee6d34bMe287M4763M8c18Mf979002374be%3Ai-066b4e539b2a5cf54&database=1&docidlist=cpx_7bbc484014a175f41b3M5d3110178163125&handlelist=0&displayformat=detailed 
    //https://www.engineeringvillage.com/delivery/download/submit.url?usageZone=oneclick&usageOrigin=recordpage&downloadformat=ris&filenameprefix=Engineering_Village&database=1&displayformat=detailed&docidlist=cpx_7bbc484014a175f41b3M5d3110178163125&handlelist=0
    result.unitid = param.docidlist;
	  switch (param.downloadformat) {
	  case 'excel':
		  result.rtype    = 'ABS';
	    result.mime     = 'XLS';
	    break;
	 case 'pdf':
      result.rtype    = 'ABS';
      result.mime     = 'PDF';
      break;
	 case 'ascii':
      result.rtype    = 'ABS';
      result.mime     = 'TEXT';
      break;
	 case 'ris':
      result.rtype    = 'ABS';
      result.mime     = 'RIS';
      break;
	 default:
		  result.rtype    = 'ABS';
      result.mime     = 'PDF';
		}
  }
  return result;
});
