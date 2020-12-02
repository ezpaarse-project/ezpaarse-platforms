#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform LLW Health Library
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

  if ((match = /^\/solr\/searchresults.aspx$/i.exec(path)) !== null) {
    // https://meded.lwwhealthlibrary.com/solr/searchresults.aspx?q=pancreas&subonly=true&restypeid=1&page=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/book.aspx$/i.exec(path)) !== null) {
    // https://meded.lwwhealthlibrary.com/book.aspx?bookid=1040
    // https://meded.lwwhealthlibrary.com/book.aspx?bookid=2651
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.bookid;
    result.unitid   = param.bookid;
  } else if ((match = /^\/content.aspx$/i.exec(path)) !== null) {
    // https://meded.lwwhealthlibrary.com/content.aspx?sectionid=58706997&bookid=1040
    // https://meded.lwwhealthlibrary.com/content.aspx?sectionid=216698068&bookid=2651
    // https://meded.lwwhealthlibrary.com/content.aspx?sectionid=216698068&bookid=2651#216698069
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = param.bookid;
    result.unitid   = param.sectionid;
  } else if ((match = /^\/wk\/content_public\/multimedia\/.+\/(.+)\.pdf$/i.exec(path)) !== null) {
    // https://hl.silverchair-cdn.com/wk/content_public/multimedia/lo5/LO_Case10.pdf?Expires=1604443801&Signature=WUZvXwFCWuJNwCc3uH2oUNUuEo6kDyyVXbBXGifHYhRlzw6cImNjvntpuVHmCzekSI6lFU4uI-Uiy2vzS0ePLEjCIFnhNlXgUVcIl2GuqAZeaJhwGsKWYx6dusjRw4uFgeAH9OI0TMNJUNYJmB8kLh41FoPHAz0RlxgtQqB0rkCazUJLLASQAkk4gg-haHJxSZ1lCz39CqiTlmaMiGRKRNXrQ7nDDcnr0MC9PsRSDcX5rLr31hnZU698eHNbptMMjbXxCR3wY7kGoYUQz3VUYS4yRYlYfKVXrGOujuFg9elQ33IuKy9j7sPh1VG8K8cnYSyqBnU5Jjd9ZEB66iI~og__&Key-Pair-Id=APKAIE5G5CRDK6RD3PGA    
    // https://hl.silverchair-cdn.com/wk/content_public/multimedia/rieg6/Riegelman_Chapter_Objectives_Ch01.pdf?Expires=1604444156&Signature=QClmwTFOWXgfnOe6UF8xH7ddLP4zCB4FkqB9tdkkq93mYaI0uKWJuCvL35qdKR8Bru6wgpUIUXmOLouBIkdNq0lhOQtkGHlAiwlKD1GVun0kvpyybOtEsaF9zRYpDayy3HpnPf1NBs7jGzKfLtQoNQlxQHA3t~dN5xhgxkyVXi-tGcn5jhkF1NfT9q-kEG-34mb0LLD57XrfVv4g-Lw5gOr-eRpx2Wl51c9nU94VdVArycNxKfm3iqzoLmkRx9Y85H5~HAR8CWafsOmLsSOszr96FvVu9QALkfEIyS7R2DY7alz5hT6P1Cx8eJs0r~HNcuR0Qk5vlxxwB5Rn5lveCQ__&Key-Pair-Id=APKAIE5G5CRDK6RD3PGA
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if ((match = /^\/wolterskluwer_vitalstream_com\/journal_library\/(.+)\.pdf$/i.exec(path)) !== null) {
    // http://downloads.lww.com/wolterskluwer_vitalstream_com/journal_library/cnq_08879303_2006_29_1_2.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if ((match = /^\/multimediaPlayer.aspx$/i.exec(path)) !== null) {
    // https://meded.lwwhealthlibrary.com:9443/multimediaPlayer.aspx?multimediaid=13673867
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = param.multimediaid;
    result.unitid   = param.multimediaid;
  } else if ((match = /^\/wk\/content_public\/multimedia\/port3\/.+\/(.+).html$/i.exec(path)) !== null) {
    // https://hl.silverchair-cdn.com/wk/content_public/multimedia/port3/Heart_and_Breath_Sounds/Porth_HeartandBreathSounds_Audio_01.html
    result.rtype    = 'AUDIO';
    result.mime     = 'MP3';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
