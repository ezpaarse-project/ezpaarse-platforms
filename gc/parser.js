#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Gale Cengage
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/ps\/([a-zA-z]+).do$/.exec(path)) !== null) {
    // /ps/eToc.do
    //?userGroupName=franche&prodId=GVRL&inPS=true&action=DO_BROWSE_ETO
    //isETOC=true&inPS=true&prodId=GVRL&userGroupName=unipari&resultListType=RELATED_DOCUMENT
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    if (/[\w]Toc/.test(match[1])) {
      result.rtype    = 'TOC';
    }
    if (param.docId) {
      result.title_id = param.docId;
      result.unitid   = param.docId + '_' + param.contentSegment;
    }
    if (param.workId && /[\w\W]pdf/.test(param.workId)) {
      result.mime     = 'PDF';
      result.unitid   = param.docId + '_' + param.workId.split('|')[0];
    }

  } else if ((match = /^\/cgi-bin\/([a-z]+)$/.exec(path)) !== null) {
    //http://rs.go.galegroup.com/cgi-bin/rsent
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'MISC';
    if (param.docId && param.contentSegment) {
      result.title_id = param.docId;
      result.unitid   = param.docId + '_' + param.contentSegment;
    }
  } else if ((match = /^\/ps\/pdfViewer$/.exec(path)) !== null){
    // http://go.galegroup.com/ps/pdfViewer?docId=GALE%7CCX2976600014&userGroupName=spcesr&inPS=true&contentSegment=&prodId=GVRL&isETOC=true&accesslevel=FULLTEXT&c2c=true	
		 result.rtype    = 'BOOK';
		 result.mime     = 'PDF';
		 result.unitid = param.docId;
	} else if ((match = /^\/gdc-artemis\/bulkPdfDownload$/.exec(path)) !== null){
    // http://gdc.galegroup.com/gdc-artemis/bulkPdfDownload?file_name=SC5107483286&download_url=http%3A%2F%2Fcallisto.ggsrv.com%2Fimgsrv%2FFastPDF%2FUBER2%2FGDSC00224F005502440%268465%261486017415.pdf 	
     result.rtype    = 'ARTICLE';
     result.mime     = 'PDF';
     result.unitid = param.file_name;
  } else if ((match = /^\/gdc\/artemis\/ManuscriptsDetailsPage\/ManuscriptsDetailsWindow$/.exec(path)) !== null){
    // http://gdc.galegroup.com/gdc/artemis/ManuscriptsDetailsPage/ManuscriptsDetailsWindow?action=f&documentId=GALE%7CSC5107483286&id=clearDocumentInSession&cacheability=PAGE&p=GDCS&u=	
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = param.documentId;
	} else if ((match = /^\/gdsc\/retrieve.do$/.exec(path)) !== null){
    //http://go.galegroup.com/gdsc/retrieve.do?sgHitCountType=None&sort=DA-ASC-SORT&inPS=true&prodId=GDSC&userGroupName=spcesr&tabID=T001&searchId=R1&resultListType=RESULT_LIST&contentSegment=&searchType=AdvancedSearchForm&currentPosition=1&contentSet=GALE%7CSC5107486613&&docId=GALE|SC5107486613&docType=GALE&viewtype=Manuscript 	
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = param.contentSet;
  } else if ((match = /^\/gdsc\/downloadDocument.do$/.exec(path)) !== null){
    // http://go.galegroup.com/gdsc/downloadDocument.do?actionCmd=DO_DOWNLOAD_WRAPPDF&bucketId=&inPS=true&prodId=GDSC&userGroupName=spcesr&tabID=T001&docId=GALE%7CSC5107486613&dynamicEtocAvail=&pubDate=&browseDoc=&viewtype=Manuscript&downloadFormat=PDF&type=PRINT_CURRENT_IMAGE&optiontype=PRINT_ENTIRE_IMAGE&imageNumbers=1&marklist=false&downloadFormat=PRINT_ENTIRE_IMAGE&marklist=false&recordID=&downloadFormat=PRINT_NEXT_EIGHT_IMAGE&marklist=false&recordID=&docContentSegment=GDSC143|
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = param.docId;
  } else if ((match = /^\/([a-z]+)\/([a-z]+)\/MonographsDetailsPage\/MonographsDetailsWindow$/.exec(path)) !== null){
    // http://gdc.galegroup.com/gdc/artemis/MonographsDetailsPage/MonographsDetailsWindow?disableHighlighting=false&displayGroupName=DVI-Monographs&result_type=DVI-Monographs&javax.portlet.action=detailsViewWithNavigation&currPage=1&scanId=&query=OQE+arabic&prodId=EAPB&source=fullList&search_within_results=&p=EAPB&catId=&u=spcesr&limiter=&totalSearchResultCount=&display-query=OQE+arabic&contentModules=&displayGroups=&action=1&sortBy=&activityType=BasicSearch&failOverType=&commentary=&documentId=GALE|ZVZZDR996049640&dviSelectedPage=&catId=
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = param.documentId;
  }  else if ((match = /^\/([a-z]+)\/archive\/FeatureArticlesDetailsPage\/FeatureArticlesDetailsWindow$/.exec(path)) !== null){
    //http://natgeo.galegroup.com/natgeo/archive/FeatureArticlesDetailsPage/FeatureArticlesDetailsWindow?disableHighlighting=&displayGroupName=NatGeo-Features&currPage=&dviSelectedPage=&scanId=&query=&source=&prodId=NGMA&search_within_results=&p=NGMA&mode=view&catId=&u=spcesr&limiter=&display-query=&displayGroups=&contentModules=&action=e&sortBy=&documentId=GALE%7CLCXYNN294769130&windowstate=normal&activityType=&failOverType=&commentary=
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid = param.documentId;
  }
	
  return result;
});

