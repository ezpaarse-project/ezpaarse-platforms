#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Thomson Reuters Westlaw
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if (/^\/V1\/Session\/GetSponsorInformation/i.test(path)) {
    // https://1.next.westlaw.com:443/V1/Session/GetSponsorInformation?sp=002057769-2100
    result.rtype    = 'CONNECTION';
    result.mime     = 'MISC';
    result.unitid   = param.sp;

  } else if (/^\/Search\/Results.html/i.test(path)) {
    // https://1.next.westlaw.com:443/Search/Results.html?...
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/Document\/([a-zA-Z0-9]+)\/View\/FullText.html/i.exec(path)) !== null) {
    // https://1.next.westlaw.com:443/Document/Ib8b8e0f149af11db99a18fc28eb0d9ae/View/FullText.html?...
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/RelatedInformation\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+).html/i.exec(path)) !== null) {
    // https://1.next.westlaw.com:443/RelatedInformation/I4374de02468811dabbce983553c9ef8b/kcCitingReferences.html?...
    // https://1.next.westlaw.com:443/RelatedInformation/I4374de02468811dabbce983553c9ef8b/kcTableOfAuthorities.html?...
    result.rtype    = 'SUPPL';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/Browse\/Home\/([a-zA-Z0-9_/-]+)?/i.exec(path)) !== null) {
    // https://1.next.westlaw.com:443/Browse/Home/Regulations?transitionType=Default&contextData=(sc.Default)
    // https://1.next.westlaw.com:443/Browse/Home/AdministrativeDecisionsGuidance/EqualEmploymentOpportunityCommission/EEOCComplianceManual?transitionType=Default&contextData=(sc.Default)
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if (/^\/Link\/Document\/FullText/i.test(path)) {
    // https://1.next.westlaw.com:443/Link/Document/FullText?findType=L&pubNum=1000546&cite=28USCAS959&originatingDoc=Ia4b36d45991911e18b7b0000837bc6dd&refType=LQ&originationContext=document&transitionType=DocumentItem&contextData=(sc.Keycite)
    // https://1.next.westlaw.com:443/Link/Document/FullText?findType=Y&serNum=1976019476&pubNum=0000108&originatingDoc=If77be74330fa11d98057925bad68b741&refType=RP&originationContext=document&transitionType=DocumentItem&contextData=(sc.RelatedInfo)
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.originatingDoc;

  }

  return result;
});
