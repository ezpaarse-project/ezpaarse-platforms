#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Extract db_id 
 */
function extractDatabaseName (parsedUrl, result) {
  let hostParts = parsedUrl.host.split('.');
  result.db_id    = hostParts[0];
}


/**
 * Recognizes the accesses to the platform Access Medicine
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};
  // use console.error for debuging

  let hash;

  if (parsedUrl.hash) {
    hash = parsedUrl.hash
      .replace('#', '')
      .split('&')
      .reduce(function (result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
      }, {});
  } else {
    hash = {};
  }
  let match;

  //console.error(hash.monoNumber);

  if ((match = /^\/searchresults\.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/searchresults.aspx?q=motrin
    // https://accessmedicine.mhmedical.com/searchresults.aspx?q=chronic+exertional+compartment+syndrome&subonly=True    
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    extractDatabaseName(parsedUrl, result);
  } else if ((match = /^\/patientEdHandouts\.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/patientEdHandouts.aspx?gbosID=356307
    // https://accessmedicine.mhmedical.com/patientEdHandouts.aspx?gbosID=250260    
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.gbosID;
    extractDatabaseName(parsedUrl, result);
  } else if ((match = /^\/mgh\/content_public\/gboscontainer\/[0-9]+\/([0-9a-z_]+)\.pdf$/i.exec(path)) !== null) {
    // https://mgh.silverchair-cdn.com/mgh/content_public/gboscontainer/123/pa_mecramsv_hhg_spa.pdf?Expires=1608160901&Signature=NYn~wN0QcIA7S-wPu0ZbkVYy5fpHaIj~DqP9s6KtQ3Id0RTjx7xuPfLZt2IARSJElsdGfOYksNxdX83AunvjZ50e1XXsrKwCcuKXGnAsi5JXCqxgQKiUJ70sJGZc3n2LiQmOEm2S1sqvU4qTGokDCPW~GY23fSqD7h6EHF2Qi9tqjB8yJxCZaKnEEa3u0XLaMWqGXgw4~cY5ASHp1ZG3u20vvUb-FHc2w4AF~rfDSdhkRwC2Lio4YBeLf~1sVfcbISK~vhRqwLKEw1KXwG3CWBmspEqHauZUcij78lSbi1ANJwMk5~JfZwBqAW9vkkW9LXeIdi4MOTzG25kSSyV5uw__&Key-Pair-Id=APKAIE5G5CRDK6RD3PGA
    // https://mgh.silverchair-cdn.com/mgh/content_public/gboscontainer/123/aa_comprtsd_sma.pdf?Expires=1608157851&Signature=K4-1DjNESBrdQk51QpiLb2FF70Wux1TN9i8BTg8HqSGZ1dGEkGgbnwDxcDcyM07ao1xirE-CZUUTMVle2huoPIIA24b77ifeaCX4FO~yRy8SXm3LUo7HsZEIg-Dqkx~eqm~w1wIPhlsHJI0LawYQZE5Ifo3Yl4P3a03bPbAxsLdltG7dCF0XLiYMYsc~MgF15xHUwL23H63YmNvkZBqd4sAfwHD2IGMSepd6FeLf7Xu7TjZQ-GwGe~qn8v8qVoSSyA8Uv7COpE6SfzQrPwtBGgtMN2J04xDVzCl5v64Pm141yz4KofgkXlyDsO8Zb-fNqOegjSKfc9HdjT9Buk45Tw__&Key-Pair-Id=APKAIE5G5CRDK6RD3PGA
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  } else if ((match = /^\/MultimediaPlayer.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/MultimediaPlayer.aspx?MultimediaID=13551243
    // https://accessmedicine.mhmedical.com/MultimediaPlayer.aspx?MultimediaID=17965166    
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.unitid   = param.MultimediaID;
    extractDatabaseName(parsedUrl, result);
  } else if ((match = /^\/herbsandsupplements.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/herbsandsupplements.aspx?letter=t&gbosid=381766&sectionid=223472100
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.gbosid;
    extractDatabaseName(parsedUrl, result);
  } else if ((match = /^\/ViewLarge.aspx$/i.exec(path)) !== null) {
    // https://accesspharmacy.mhmedical.com/ViewLarge.aspx?figid=248154789
    result.rtype    = 'TABLE';
    result.mime     = 'HTML';
    result.unitid   = param.figid;
    extractDatabaseName(parsedUrl, result);
  } else if (/^\/updatesContent\.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/updatesContent.aspx?gbosid=555081&sectionid=252895650&categoryid=41174
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.gbosid;
    extractDatabaseName(parsedUrl, result);
  } else if (/^\/drugs\.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/drugs.aspx#monoNumber=423186&sectionID=00&tab=tab0
    // https://accessmedicine.mhmedical.com/drugs.aspx#monoNumber=426051&sectionID=03&tab=tab1    
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = hash.monoNumber;
    extractDatabaseName(parsedUrl, result);
  } else if (/^\/book.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/book.aspx?bookID=1755
    // https://accesssurgery.mhmedical.com/book.aspx?bookID=2576
    // https://accesspharmacy.mhmedical.com/book.aspx?bookid=2868
    // https://accessmedicine.mhmedical.com/book.aspx?bookid=1180
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (param.bookID) {
      result.unitid   = param.bookID;
    } else {
      result.unitid   = param.bookid;
    }
    extractDatabaseName(parsedUrl, result);
  } else if (/^\/content.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/content.aspx?bookid=2576&sectionid=210404908
    // https://accesssurgery.mhmedical.com/content.aspx?bookid=2961&sectionid=250821086
    // https://accesspharmacy.mhmedical.com/content.aspx?bookid=1731&sectionid=116669137
    // https://accessmedicine.mhmedical.com/content.aspx?sectionid=70381398&bookid=1180#70381726    
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = param.bookid + '-' + param.sectionid;
    extractDatabaseName(parsedUrl, result);
  } else if (/^\/CaseContent.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/CaseContent.aspx?gbosID=246092&gbosContainerID=92&viewByNumber=false&groupid=0
    // https://accessmedicine.mhmedical.com/CaseContent.aspx?gbosID=533934&gbosContainerID=245#240777564
    // https://accessmedicine.mhmedical.com/CaseContent.aspx?gbosID=459684&gbosContainerID=224&viewByNumber=false&groupid=1344#210735386    
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid   = param.gbosID;
    extractDatabaseName(parsedUrl, result);
  } else if (/^\/ViewLarge.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/ViewLarge.aspx?figid=222022974&gbosContainerID=0&gbosid=0&groupID=0&sectionId=210404908&multimediaId=undefined
    result.rtype    = 'FIGURE';
    result.mime     = 'HTML';
    result.unitid   = param.figid;
    extractDatabaseName(parsedUrl, result);
  }

  return result;
});


