#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform PsychiatryOnline
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.path;
  let hostname = parsedUrl.hostname
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /doi\/full\/(.*?)\/(.*)/.exec(path)) !== null) {
    // http://ajp.psychiatryonline.org:80/doi/full/10.1176/appi.ajp.2017.17050539
    if ((/\.(.*?)\./.exec(match[2])[1]) == 'books') {
      result.rtype  = 'BOOK_SECTION';
    } else {
      result.rtype  = 'ARTICLE';
    }
    result.mime     = 'HTML';
    result.doi = match[1];
    result.unitid = match[2];
    if ((/appi\.books\.(.*)/.exec(match[2])) !== null) {
      result.print_identifier = (/appi\.books\.(.*)\./.exec(match[2]))[1]
    }

  /**
   * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
   * it described the most fine-grained of what's being accessed by the user
   * it can be a DOI, an internal identifier or a part of the accessed URL
   * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
   */

  } else if ((match = /doi\/pdf\/(.*?)\/(.*)/.exec(path)) !== null) {
    // http://ajp.psychiatryonline.org:80/doi/pdf/10.1176/appi.ajp-rj.2017.121001
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi = match[1];
    result.unitid   = match[2];
  } else if ((match = /doi\/pdfplus\/(.*?)\/(.*)/.exec(path)) !== null) {
    // http://ajp.psychiatryonline.org:80/doi/pdfplus/10.1176/appi.ajp.2017.17050539
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDFPLUS';
    result.doi = match[1];
    result.unitid   = match[2];
  } else if ((match = /audio$/.exec(path)) !== null) {
    // http://ajp.psychiatryonline.org:80/audio
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
  } else if ((match = /journals\/ajp\/audio\/2017\/(.*)/.exec(path)) !== null) {
    // http://ajp.psychiatryonline.org:80/pb/assets/raw/journals/ajp/audio/2017/October_2017.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.title_id = match[1];
  } else if ((match =/toc\/ajp\/(.*)/.exec(path)) !== null) {
    // http://ajp.psychiatryonline.org.proxytest.library.emory.edu/toc/ajp/174/10
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /doi\/abs\/(.*?)\/(.*)/.exec(path)) !== null) {
    // http://ajp.psychiatryonline.org:80/doi/abs/10.1176/appi.ajp.2017.17070796
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[2];
  } else if ((match = /doi\/book\/(.*?)\/(.*)/.exec(path)) !== null) {
    // http://dsm.psychiatryonline.org:80/doi/book/10.1176/appi.books.9781585624836
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[2];
    result.print_identifier = (/appi\.books\.(.*)/.exec(path))[1]
  } else if ((match = /doi\/([0-9]*\.[0-9]*?)\/(.*)/.exec(path)) !== null) {
    // http://ps.psychiatryonline.org:80/doi/10.1176/appi.ps.201700055
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[2];
  } else if ((match = /doi\/ref\/(.*?)\/(.*)/.exec(path)) !== null) {
    // http://ps.psychiatryonline.org:80/doi/ref/10.1176/appi.ps.201700055
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[2];
  } else if ((match = /doi\/suppl\/(.*?)\/(.*)/.exec(path)) !== null) {
    // http://ps.psychiatryonline.org:80/doi/suppl/10.1176/appi.ps.201700055
    result.rtype    = 'SUPPL';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[2];
  } else if ((match = /international/.exec(path)) !== null) {
    // http://psychiatryonline.org:80/international
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  } else if ((match = /cme/.exec(path)) !== null) {
    // http://psychiatryonline.org:80/cme
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  }

  if (match !== null) {
    if (/([a-z]*?)\./.exec(hostname)[1] == 'ajp') {
      result.publication_title = 'American Journal of Psychiatry';
    } else if (/([a-z]*?)\./.exec(hostname)[1] == 'dsm') {
      result.publication_title = 'DSM Library';
    } else if (/([a-z]*?)\./.exec(hostname)[1] == 'focus') {
      result.publication_title = 'Focus';
    } else if (/([a-z]*?)\./.exec(hostname)[1] == 'neuro') {
      result.publication_title = 'Journal of Neuropsychiatry and Clinical Neuroscience';
    } else if (/([a-z]*?)\./.exec(hostname)[1] == 'prcp') {
      result.publication_title = 'Psychiatric Research & Clincal Practice';
    } else if (/([a-z]*?)\./.exec(hostname)[1] == 'ps') {
      result.publication_title = 'Psychiatric Services';
    } else if (/([a-z]*?)\./.exec(hostname)[1] == 'psychnews') {
      result.publication_title = 'Psychiatric News';
    }
  }

  return result;
});
