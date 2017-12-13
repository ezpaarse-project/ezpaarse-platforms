#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American College of Physicians
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

  if ((match = /^\/data\/Journals\/AIM\/([0-9]+)\/(.*?)\.mp3$/i.exec(path)) !== null) {
    // http://annals.org:80/data/Journals/AIM/936572/annals_20171107.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[1];
    result.title_id = match[2];
  } else if ((match = /^\/weekly\/archives\/(.*?)\.htm$/i.exec(path)) !== null) {
    // http://www.acpinternist.org:80/weekly/archives/2017/11/07/1.htm
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/aim\/fullarticle\/([0-9]+)\/([a-zA-Z0-9-]+)/i.exec(path)) !== null) {
    // http://annals.org:80/aim/fullarticle/2661483/self-administered-versus-directly-observed-once-weekly-isoniazid-rifapentine-treatment
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
  } else if ((match = /^\/archives\/(\d\d\d\d\/\d\d)\/(.*?)\.htm$/i.exec(path)) !== null) {
    // http://www.acpinternist.org:80/archives/2017/11/patients-and-priorities-in-prostate-cancer-care.htm
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
  } else if ((match = /^\/data\/journals\/aim\/([0-9]+)\/(.*?)\.pdf$/i.exec(path)) !== null) {
    // http://annals.org:80/data/journals/aim/0/aime201711210-m171150.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
    result.title_id = match[2];
  } else if ((match = /^\/aim\/article-abstract\/([0-9]+)\/(.*)$/i.exec(path)) !== null) {
    // http://annals.org:80/aim/article-abstract/2661485/communicability-chronic-diseases
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
  } else if ((match = /search/i.exec(path)) !== null) {
    // http://www.acphospitalist.org:80/search/?site=ACP_Hospitalist&q=%22Clinical+Medicine%22&requiredfields=keywords:clinical+medicine
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/acp-newsroom\/multimedia\/\?bclid=([0-9]+)&bctid=([0-9]+)$/i.exec(path)) !== null) {
    // https://www.acponline.org/acp-newsroom/multimedia/?bclid=782539368001&bctid=4715367376001
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = match[1];
    result.title_id = match[2];
  } else if ((match = /^\/practice-resources/i.exec(path)) !== null) {
    //  https://www.acponline.org:443/practice-resources/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  } else if (hostname === 'advocacyblog.acponline.org') {
    // http://advocacyblog.acponline.org:80/2017/08/
    if ((match = /([0-9]+\/[0-9]+)/.exec(path)) !== null) {
      result.rtype    = 'REF';
      result.mime     = 'HTML';
      result.title_id = match[1];
    }
  }

  if (hostname === 'annals.org') {
    result.publication_title = 'Annals of Internal Medicine';
  } else if (hostname === 'www.acpinternist.org') {
    result.publication_title = 'ACP Internist';
  } else if (hostname === 'www.acphospitalist.org') {
    result.publication_title = 'ACP Hospitalist';
  } else if (hostname === 'advocacyblog.acponline.org') {
    result.publication_title = 'ACP Advocate Blog';
  } else if (hostname === 'annualmeeting.acponline.org') {
    result.publication_title = 'Internal Medicine Meeting'
  }

  return result;
});
