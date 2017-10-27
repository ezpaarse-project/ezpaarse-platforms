#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * [description-goes-here]
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.path;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  console.error(parsedUrl);

  let match;

  /**
   * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
   * it described the most fine-grained of what's being accessed by the user
   * it can be a DOI, an internal identifier or a part of the accessed URL
   * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
  */

  if ((match = /UserDashboard\/([A-Za-z]*)\?ResourceId=([0-9]*)&ResourceType=([A-Za-z0-9]*)/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/UserDashboard/AddFavorites?ResourceId=853&ResourceType=Book
    if (match[3] == 'Book') {
      result.rtype = 'BOOK';
      result.mime  = 'HTML';
    } else if (match[3] == 'section') {
      result.rtype = 'BOOK_SECTION';
      result.mime  = 'HTML';
    } else if (match[3] == 'Section') {
      result.rtype = 'BOOK_SECTION';
      result.mime  = 'HTML';
    } else if (match[3] == 'gbos') {
      result.rtype = 'REF';
      result.mime  = 'HTML';
    } else if (match[3] == 'Multimedia') {
      result.rtype = 'VIDEO';
      result.mime  = 'MISC';
    } else if (match[3] == '4') {
      result.rtype = 'REF';
      result.mime  = 'HTML';
    }
    result.unitid     = match[2];
  } else if ((match = /SearchResults/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/SearchResults.aspx?q=follicular+neoplasm+thyroid
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /([A-Za-z]*)\/CaseContent\/([A-Za-z]*)\?([A-Za-z]*)=([0-9]*)/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/Content/CaseContent/TakeQuizOneByOne?sectionId=130873251
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[4];
  } else if ((match = /CaseContent\.([a-z]*)\?([A-Za-z]*)=([0-9]*)&([A-Za-z]*)=([0-9]*)/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com.proxytest.library.emory.edu/CaseContent.aspx?gbosID=246115&gbosContainerID=92
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[3];
  } else if ((match = /([a-z]*?)\.([a-z]*)\/([A-Za-z]*)/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/drugs.aspx/displayMonograph
    if (match[1] == 'drugs') {
      result.rtype    = 'REF';
    }
    result.mime     = 'HTML';
  } else if ((match = /([a-z]*?)\.([a-z]*)\/([A-Za-z0-9]*)/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/drugs.aspx/displayDrugDetailByNDC9FromLexiAPI
    if (match[1] == 'drugs') {
      result.rtype    = 'REF';
    }
    result.mime     = 'HTML';
  } else if ((match=/([a-z]*\.[a-z]*)\?([A-Za-z]*)=([0-9]*)&([A-Za-z]*)=([0-9]*)&([a-z]*)=\/([a-z]*)\/([a-z]*)\/([0-9]*)\/([a-z]*_[a-z]*_[a-z]*\.pdf)/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/pdfaccess.ashx?PDFSource=15&ResourceID=14704220&url=/data/gboscontainer/123/ac_abdominalpain_dx.pdf
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.unitid   = match[5];
  } else if ((match = /([A-Za-z]*)\/([A-Za-z_]*).pdf/.exec(path)) !== null) {
    //http://jamaevidence.mhmedical.com:80/DocumentLibrary/JAMAevidence_Glossary_Final.pdf
    result.rtype    = 'REF';
    result.mime     = 'PDF';
  } else if ((match = /calculator\.([a-z]*)\?([a-z]*)=([0-9]*)/.exec(path)) !== null) {
    // http://jamaevidence.mhmedical.com:80/calculator.aspx?calc=142830
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[3];
  } else if ((match = /podcast\/([a-z]*)\/(.*)/.exec(path)) !== null) {
    // http://books.mcgraw-hill.com:80/podcast/jamaevidencepc/Guyatt_Cut_K.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MP3';
    result.publication_title = match[2];
  } else if ((match = /\/[0-9]*\/[0-9]*\/[0-9]*\/(.*?)\//.exec(path)) !== null) {
    // https://ommbidblog.com:443/2016/08/17/new-syndrome-of-gnb5-deficiency/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.publication_title = match[1];
  }

  return result;
});
