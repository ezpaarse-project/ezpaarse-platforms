#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Dimensions
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
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/details\/publication\/([a-zA-Z0-9.]+)$/i.exec(path)) !== null && param.or_facet_document_type == 'OTHER_CONFERENCE_CONTENT') {
    // https://app.dimensions.ai/details/publication/pub.1169867315?or_facet_document_type=OTHER_CONFERENCE_CONTENT
    // https://app.dimensions.ai/details/publication/pub.1169867563?or_facet_document_type=OTHER_CONFERENCE_CONTENT
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.pii = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/details\/publication\/([a-zA-Z0-9.]+)$/i.exec(path)) !== null && (param.or_facet_document_type == 'CORRECTION_ERRATUM' || param.or_facet_document_type == 'EDITORIAL' || param.or_facet_document_type == 'LETTER_TO_EDITOR' || param.or_facet_document_type == 'BOOK_REVIEW' || param.or_facet_document_type == 'CONFERENCE_PAPER' || param.or_facet_document_type == 'RESEARCH_ARTICLE')) {
    // https://app.dimensions.ai/details/publication/pub.1168968361?or_facet_document_type=CORRECTION_ERRATUM
    // https://app.dimensions.ai/details/publication/pub.1169675787?or_facet_document_type=CORRECTION_ERRATUM
    // https://app.dimensions.ai/details/publication/pub.1168875268?or_facet_document_type=LETTER_TO_EDITOR
    // https://app.dimensions.ai/details/publication/pub.1168540226?or_facet_document_type=LETTER_TO_EDITOR
    // https://app.dimensions.ai/details/publication/pub.1170272130?or_facet_document_type=BOOK_REVIEW
    // https://app.dimensions.ai/details/publication/pub.1169533246?or_facet_document_type=BOOK_REVIEW
    // https://app.dimensions.ai/details/publication/pub.1168746578?or_facet_document_type=EDITORIAL
    // https://app.dimensions.ai/details/publication/pub.1167954028?or_facet_document_type=EDITORIAL
    // https://app.dimensions.ai/details/publication/pub.1168057325?or_facet_document_type=CONFERENCE_PAPER
    // https://app.dimensions.ai/details/publication/pub.1168053624?or_facet_document_type=CONFERENCE_PAPER
    // https://app-dimensions-ai.zulib.idm.oclc.org/details/publication/pub.1156013767?search_mode=content&search_text=instrument&search_type=kws&search_field=full_search&or_facet_document_type=RESEARCH_ARTICLE
    // https://app.dimensions.ai/details/publication/pub.1141582510?search_mode=content&search_text=instrument&search_type=kws&search_field=full_search&or_facet_document_type=RESEARCH_ARTICLE
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.pii = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/details\/publication\/([a-zA-Z0-9.]+)$/i.exec(path)) !== null && (param.or_facet_document_type == 'OTHER_BOOK_CONTENT' || param.or_facet_document_type == 'RESEARCH_CHAPTER')) {
    // https://app.dimensions.ai/details/publication/pub.1170312630?or_facet_document_type=OTHER_BOOK_CONTENT
    // https://app-dimensions-ai/details/publication/pub.1170484188?or_facet_document_type=OTHER_BOOK_CONTENT
    // https://app.dimensions.ai/details/publication/pub.1155596666?search_mode=content&search_text=plastic&search_type=kws&search_field=full_search&or_facet_document_type=RESEARCH_CHAPTER
    // https://app.dimensions.ai/details/publication/pub.1155539659?search_mode=content&search_text=plastic&search_type=kws&search_field=full_search&or_facet_document_type=RESEARCH_CHAPTER
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.pii = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/details\/publication\/([a-zA-Z0-9.]+)$/i.exec(path)) !== null && param.or_facet_document_type == 'CONFERENCE_ABSTRACT') {
    // https://app.dimensions.ai/details/publication/pub.1170299728?or_facet_document_type=CONFERENCE_ABSTRACT
    // https://app.dimensions.ai/details/publication/pub.1170297189?or_facet_document_type=CONFERENCE_ABSTRACT
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.pii = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/details\/publication\/([a-zA-Z0-9.]+)$/i.exec(path)) !== null && param.or_facet_document_type == 'REFERENCE_WORK') {
    // https://app.dimensions.ai/details/publication/pub.1043122011?search_mode=content&search_text=instrument&search_type=kws&search_field=full_search&or_facet_document_type=REFERENCE_WORK
    // https://app.dimensions.ai/details/publication/pub.1149793615?search_mode=content&search_text=instrument&search_type=kws&search_field=full_search&or_facet_document_type=REFERENCE_WORK
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.pii = match[1];
    result.unitid   = match[1];
  } else if (/^\/discover\/publication$/.test(path)) {
    // https://app.dimensions.ai/discover/publication?search_mode=content&search_text=instrument&search_type=kws&search_field=full_search
    // https://app.dimensions.ai/discover/publication?search_mode=content&search_text=plastic&search_type=kws&search_field=full_search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
