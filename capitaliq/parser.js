#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Standard and Poor’s Net Advantage (Capital IQ)
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((/^\/CIQDotNet\/Screening\/ResultsPreview\/ResultsPreviewPage.aspx$/i.test(path)) || (/^\/CIQDotNet\/Search\/Search.aspx$/i.test(path))) {
    // https://www.capitaliq.com:443/CIQDotNet/Screening/ResultsPreview/ResultsPreviewPage.aspx?uniqueScreenId=2106611584&previewlineitemorder=1&error=0
    // https://www.capitaliq.com:443/CIQDotNet/Search/Search.aspx?searchscope=People
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if ((match = /^\/CIQDotNet\/(Person\/PersonProfile|company).aspx$/i.exec(path)) !== null) {
    // https://www.capitaliq.com:443/CIQDotNet/Person/PersonProfile.aspx?personid=310866&proid=597467852
    // https://www.capitaliq.com:443/CIQDotNet/company.aspx?companyId=97199
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = param.personid || param.companyId;

  } else if (/^\/CIQDotNet\/Service\/Documents\/DownloadResearchDocumentWithErrorHandling.axd$/i.exec(path)) {
    // https://www.capitaliq.com:443/CIQDotNet/Service/Documents/DownloadResearchDocumentWithErrorHandling.axd?&activityTypeId=2891&researchDocumentId=41723954&fileName=Quantamental+Research+-+The+Dating+Game+Decrypting+The+Signals+In+Earnings+Report+Dates 
    //https://www.capitaliq.com:443/CIQDotNet/Service/Documents/DownloadResearchDocumentWithErrorHandling.axd?&activityTypeId=2891&researchDocumentId=43104785&fileName=S%26P+500+Earnings+Report+Week+of+11%2f25%2f2019
    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    result.title_id = param.researchDocumentId;
    result.unitid   = param.researchDocumentId;

  } else if ((match = /^\/CIQDotNet\/(BusinessRel|Charting4|Company|FixedIncome|Index|KeyDevs|Lists|MacroEconomics)\/([a-zA-Z0-9-]+).aspx$/i.exec(path)) !== null) {
    // https://www.capitaliq.com:443/CIQDotNet/BusinessRel/InvestmentAnalysis.aspx?CompanyId=274494148&initialView=1
    // https://www.capitaliq.com:443/CIQDotNet/BusinessRel/Investors.aspx?CompanyId=274494148
    // https://www.capitaliq.com:443/CIQDotNet/Company/BoardMembers.aspx?CompanyId=274494148&limitFunctions=3
    // https://www.capitaliq.com:443/CIQDotNet/Company/Committees.aspx?CompanyId=274494148
    // https://www.capitaliq.com:443/CIQDotNet/Company/Professionals.aspx?CompanyId=274494148
    // https://www.capitaliq.com:443/CIQDotNet/FixedIncome/FixedIncome.aspx?CompanyId=274494148
    // https://www.capitaliq.com:443/CIQDotNet/KeyDevs/KeyDevelopments.aspx?CompanyId=274494148&selDateRangeOption=m6&chkSubs=1
    // https://www.capitaliq.com:443/CIQDotNet/Index/IndexWidgetTearsheet.aspx?companyId=2668699
    // https://www.capitaliq.com:443/CIQDotNet/Lists/KeyProfessionals.aspx?listObjectId=100884797
    // https://www.capitaliq.com:443/CIQDotNet/Lists/KeyStats.aspx?listObjectId=100884797
    // https://www.capitaliq.com:443/CIQDotNet/Lists/Profile.aspx?listObjectId=113153695
    // https://www.capitaliq.com:443/CIQDotNet/Charting4/ModernBuilder.aspx?fromC3=1&fromC2=1
    // https://www.capitaliq.com:443/CIQDotNet/MacroEconomics/InterestRatesOverview.aspx
    result.rtype    = 'DATASET';
    result.mime     = 'HTML';
    result.title_id = match[1] + '/' + match[2];
    result.unitid   = param.CompanyId || param.companyId || param.listObjectId || match[2];

  }

  return result;
});
