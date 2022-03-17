#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const database = require('./database.json');

/**
 * Recognizes the accesses to the platform Gale Cengage
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  let hash = new Map((parsedUrl.hash || '').replace('#', '').split('&').map(s => s.split('=')));
  let match;

  if ((match = /^\/ps\/([a-zA-z]+).do$/i.exec(path)) !== null && !param.qt) {
    // /ps/eToc.do
    //?userGroupName=franche&prodId=GVRL&inPS=true&action=DO_BROWSE_ETO
    //isETOC=true&inPS=true&prodId=GVRL&userGroupName=unipari&resultListType=RELATED_DOCUMENT
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime = 'HTML';

    if (/^[\w]Toc/.test(match[1])) {
      result.rtype = 'TOC';
    }

    if (/^article$/i.test(param.docType)) {
      result.rtype = 'ARTICLE';
    }

    if (param.docId) {
      result.title_id = param.docId;
      result.unitid = param.docId + '_' + param.contentSegment;
    }
    if (param.workId && /[\w\W]pdf/.test(param.workId)) {
      result.mime = 'PDF';
      result.unitid = param.docId + '_' + param.workId.split('|')[0];
    }
    result.db_id = param.prodId;
  } else if ((match = /^\/([a-z]+)\/archive\/FeatureArticlesDetailsPage\/FeatureArticlesDetailsWindow$/i.exec(path)) !== null) {
    // http://natgeo.galegroup.com/natgeo/archive/FeatureArticlesDetailsPage/FeatureArticlesDetailsWindow?disableHighlighting=&displayGroupName=NatGeo-Features&currPage=&dviSelectedPage=&scanId=&query=&source=&prodId=NGMA&search_within_results=&p=NGMA&mode=view&catId=&u=spcesr&limiter=&display-query=&displayGroups=&contentModules=&action=e&sortBy=&documentId=GALE%7CLCXYNN294769130&windowstate=normal&activityType=&failOverType=&commentary=
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime = 'HTML';
    result.unitid = param.documentId;
    result.title_id = match[1];
    result.db_id = param.prodId;

  } else if (/^\/cgi-bin\/([a-z]+)$/i.test(path)) {
    // http://rs.go.galegroup.com/cgi-bin/rsent
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime = 'MISC';
    result.db_id = param.prodId;
    if (param.docId && param.contentSegment) {
      result.title_id = param.docId;
      result.unitid = param.docId + '_' + param.contentSegment;
    }
  } else if (/^\/ps\/pdfViewer$/i.test(path)) {
    // http://go.galegroup.com/ps/pdfViewer?docId=GALE%7CCX2976600014&userGroupName=spcesr&inPS=true&contentSegment=&prodId=GVRL&isETOC=true&accesslevel=FULLTEXT&c2c=true
    result.rtype = 'BOOK';
    result.mime = 'PDF';
    result.unitid = param.docId;
    result.db_id = param.prodId;

  } else if (/^\/gdc-artemis\/bulkPdfDownload$/i.test(path)) {
    // http://gdc.galegroup.com/gdc-artemis/bulkPdfDownload?file_name=SC5107483286&download_url=http%3A%2F%2Fcallisto.ggsrv.com%2Fimgsrv%2FFastPDF%2FUBER2%2FGDSC00224F005502440%268465%261486017415.pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = param.file_name;
    result.db_id = param.prodId;

  } else if (/^\/gdc\/artemis\/ManuscriptsDetailsPage\/ManuscriptsDetailsWindow$/i.test(path)) {
    // http://gdc.galegroup.com/gdc/artemis/ManuscriptsDetailsPage/ManuscriptsDetailsWindow?action=f&documentId=GALE%7CSC5107483286&id=clearDocumentInSession&cacheability=PAGE&p=GDCS&u=
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = param.documentId;
    result.db_id = param.prodId;

  } else if (/^\/gdsc\/retrieve.do$/i.test(path)) {
    // http://go.galegroup.com/gdsc/retrieve.do?sgHitCountType=None&sort=DA-ASC-SORT&inPS=true&prodId=GDSC&userGroupName=spcesr&tabID=T001&searchId=R1&resultListType=RESULT_LIST&contentSegment=&searchType=AdvancedSearchForm&currentPosition=1&contentSet=GALE%7CSC5107486613&&docId=GALE|SC5107486613&docType=GALE&viewtype=Manuscript
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = param.contentSet;
    result.db_id = param.prodId;

  } else if (/^\/gdsc\/downloadDocument.do$/i.test(path)) {
    // http://go.galegroup.com/gdsc/downloadDocument.do?actionCmd=DO_DOWNLOAD_WRAPPDF&bucketId=&inPS=true&prodId=GDSC&userGroupName=spcesr&tabID=T001&docId=GALE%7CSC5107486613&dynamicEtocAvail=&pubDate=&browseDoc=&viewtype=Manuscript&downloadFormat=PDF&type=PRINT_CURRENT_IMAGE&optiontype=PRINT_ENTIRE_IMAGE&imageNumbers=1&marklist=false&downloadFormat=PRINT_ENTIRE_IMAGE&marklist=false&recordID=&downloadFormat=PRINT_NEXT_EIGHT_IMAGE&marklist=false&recordID=&docContentSegment=GDSC143|
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = param.docId;
    result.db_id = param.prodId;

  } else if (/^\/imgsrv\/FastPDF\/UBER1\//i.test(path)) {
    // http://callisto.ggsrv.com/imgsrv/FastPDF/UBER1/RangeFetch=contentSet=UBER1=prefix=ejud_0002_0018_0_=startPage=13718=suffix=-p=npages=1=dl=Scheinert_David=PDF.pdf?dl=Scheinert_David.PDF
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime = 'PDF';
    result.db_id = param.prodId;

  } else if (/^\/ps\/downloadDocument\.do$/i.test(path)) {
    // http://go.galegroup.com/ps/downloadDocument.do?actionCmd=DO_DOWNLOAD_DOCUMENT&bucketId=&inPS=true&prodId=GVRL&userGroupName=unipari&tabID=&documentTitle=Le%2BDiable%2Bau%2BCorps&docId=GALE%7CCX3406800253&currentPosition=&tagId=&dynamicEtocAvail=&pubDate=&workId=sjff_01_00332-p.pdf|sjff_01_00333-p.pdf&callistoContentSet=SJP
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime = 'PDF';
    result.unitid = param.documentId;
    result.db_id = param.prodId;

  } else if (/^\/([a-z]+)\/eToc\.do$/i.test(path)) {
    // https://go.gale.com/ps/eToc.do?searchType=BasicSearchForm&docId=GALE%7C5GVQ&userGroupName=unipari&inPS=true&action=DO_BROWSE_ETOC&contentSegment=9780028660974&prodId=GVRL
    // http://go.galegroup.com/ps/eToc.do?userGroupName=franche&prodId=GVRL&inPS=true&action=DO_BROWSE_ETOC&searchType=BasicSearchForm&docId=GALE|CX2830800013&contentSegment=9781414418889
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.documentId;
    result.db_id = param.prodId;

  } else if (/^\/([a-z]+)\/([a-z-]+)\/AcademicJournalsDetailsPage\/AcademicJournalsDetailsWindow$/i.test(path)) {
    // https://worldscholar.gale.com:443/region/latin-america/AcademicJournalsDetailsPage/AcademicJournalsDetailsWindow?disableHighlighting=false&displayGroupName=Journals&currPage=&scanId=&query=&docIndex=&source=&prodId=LAC&search_within_results=&p=LACD%3ALACP&mode=view&catId=&u=upitt_main&limiter=&display-query=&displayGroups=&contentModules=&action=e&sortBy=&documentId=GALE%7CA596402689&windowstate=normal&activityType=&failOverType=&commentary=
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = param.documentId;
    result.db_id = param.prodId;

  } else if ((match = /^\/([a-z]+)\/archive\/ImagesDetailsPage\/ImagesDetailsWindow$/i.exec(path)) !== null) {
    // https://natgeo.gale.com/natgeo/archive/ImagesDetailsPage/ImagesDetailsWindow?displayGroupName=Images&currPage=1&query=&prodId=&source=HomePage&p=NGMK&mode=view&catId=MVELUV620804877&view=docDisplay&total=984&u=bcdc&limiter=&contentModules=&displayGroups=&action=e&documentId=GALE%7CKCOUJM268196061&windowstate=normal
    result.rtype = 'IMAGE';
    result.mime = 'HTML';
    result.unitid = param.documentId;
    result.title_id = match[1];
    if (param.prodId.length > 0) {
      result.db_id = param.prodId;
    }
  } else if ((match = /^\/([a-z]+)\/archive\/VideosDetailsPage\/VideosDetailsWindow$/i.exec(path)) !== null) {
    // https://natgeo.gale.com/natgeo/archive/VideosDetailsPage/VideosDetailsWindow?displayGroupName=Videos&currPage=1&query=&prodId=&source=HomePage&p=NGMK&mode=view&catId=MVELUV620804877&view=docDisplay&total=218&u=bcdc&limiter=&contentModules=&displayGroups=&action=e&documentId=GALE%7CDTQEEB084044288&windowstate=normal
    result.rtype = 'VIDEO';
    result.mime = 'HTML';
    result.unitid = param.documentId;
    result.title_id = match[1];
    if (param.prodId.length > 0) {
      result.db_id = param.prodId;
    }
  } else if ((match = /^\/([a-z]+)\/archive\/(MonographsDetailsPage|CoversDetailsPage)\/(MonographsDetailsWindow|CoversDetailsWindow)$/i.exec(path)) !== null && hash.get('pageNo')) {
    // https://natgeo.gale.com/natgeo/archive/MonographsDetailsPage/MonographsDetailsWindow?disableHighlighting=true&displayGroupName=DVI-Monographs&currPage=1&scanId=&query=&docIndex=&source=HomePage&prodId=&search_within_results=&p=NGMK&mode=view&catId=MVELUV620804877&u=bcdc&limiter=&display-query=&displayGroups=&contentModules=&action=e&sortBy=&documentId=GALE%7CMTHOKO428853439&windowstate=normal&activityType=SelectedSearch&failOverType=&commentary=#pageNo=8
    // https://natgeo.gale.com/natgeo/archive/CoversDetailsPage/CoversDetailsWindow?disableHighlighting=false&displayGroupName=NatGeo-Covers&currPage=&scanId=&query=&docIndex=&source=&prodId=NGMK&search_within_results=&p=NGMK&mode=view&catId=&u=bcdc&limiter=&display-query=&displayGroups=&contentModules=&action=e&sortBy=&documentId=GALE%7CMWZQCM916007738&windowstate=normal&activityType=&failOverType=&commentary=#pageNo=2
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = param.documentId;
    result.title_id = match[1];
    if (param.prodId.length > 0) {
      result.db_id = param.prodId;
    }
  } else if ((match = /^\/([a-z]+)\/artemis\/MonographsDetailsPage\/MonographsDetailsWindow$/i.exec(path)) !== null) {
    // http://gdc.galegroup.com/gdc/artemis/MonographsDetailsPage/MonographsDetailsWindow?disableHighlighting=false&displayGroupName=DVI-Monographs&docIndex=1&source=&prodId=ECCO&mode=view&limiter=&display-query=OQE+%22day%22&contentModules=&action=e&sortBy=&windowstate=normal&currPage=1&dviSelectedPage=&scanId=&query=OQE+%22day%22&search_within_results=&p=GDCS&catId=&u=inisthom&displayGroups=&documentId=GALE%7CCB0132160943&activityType=BasicSearch&failOverType=&commentary=
    // http://gdc.galegroup.com/gdc/artemis/MonographsDetailsPage/MonographsDetailsWindow?disableHighlighting=false&displayGroupName=DVI-Monographs&result_type=DVI-Monographs&javax.portlet.action=detailsViewWithNavigation&currPage=1&scanId=&query=OQE+arabic&prodId=EAPB&source=fullList&search_within_results=&p=EAPB&catId=&u=spcesr&limiter=&totalSearchResultCount=&display-query=OQE+arabic&contentModules=&displayGroups=&action=1&sortBy=&activityType=BasicSearch&failOverType=&commentary=&documentId=GALE|ZVZZDR996049640&dviSelectedPage=&catId=
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = param.documentId;
    result.db_id = param.prodId;

  } else if ((match = /^\/([a-z]+)\/archive\/searchResults\/actionWin$/i.exec(path)) !== null) {
    // https://natgeo.gale.com/natgeo/archive/searchResults/actionWin?scanId=CSH&query=OQE+rocks&prodId=NGMK&p=NGMK&mode=view&catId=&u=bcdc&totalSearchResultCount=1016&limiter=&contentModules=&displayGroups=&display-query=OQE+rocks&action=e&sortBy=&windowstate=normal&activityType=BasicSearch&resetBreadCrumb=true&failOverType=&commentary=
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.db_id = param.prodId;

  } else if ((match = /^\/ps\/i\.do$/i.exec(path)) !== null && param.qt !== null) {
    // https://go.gale.com:443/ps/i.do?ty=as&v=2.1&u=upitt_main&it=DIourl&s=RELEVANCE&p=LitRC&qt=TI%7E%22MYTHOLOGY+IN+CHILDREN%27S+ANIMATION%22%7E%7ESP%7E261%7E%7EIU%7E135%7E%7ESN%7E0146-9339%7E%7EVO%7E38&lm=DA%7E120180000&sw=w
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.db_id = param.prodId;

    let metadataInfo = param.qt.split('~~').map(s => s.split('~'));
    metadataInfo = new Map(metadataInfo);
    result.vol = metadataInfo.get('VO');
    result.issue = metadataInfo.get('IU');
    result.print_identifier = metadataInfo.get('SN');
    result.first_page = metadataInfo.get('SP');
  }

  if (result.db_id) {
    if (database[result.db_id.toUpperCase()]) {
      result.db_name = database[result.db_id.toUpperCase()];
    }
  }

  return result;
});

