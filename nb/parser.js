#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Newsbank
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

  if ((match = /^\/apps\/news\/results$/i.exec(path)) !== null) {
    // https://infoweb.newsbank.com/apps/news/results?p=AMNEWS&fld-base-0=alltext&sort=YMD_date%3AD&maxresults=20&val-base-0=Ginther&t=favorite%3A1467499E%21Columbus%2520Dispatch%2520Historical%2520and%2520Current
    // https://infoweb.newsbank.com/apps/news/results?p=NewsBank&fld-base-0=alltext&sort=YMD_date%3AD&maxresults=20&val-base-0=H1N1&t=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/resources\/search\/nb$/i.exec(path)) !== null) {
    // https://infoweb.newsbank.com/resources/search/nb?p=OBIT&t=state%3AIL%21USA%2B-%2BIllinois
    // https://infoweb.newsbank.com/resources/search/nb?p=OBIT&b=results&t=state%3AIL%21USA%2B-%2BIllinois&fld0=dece&val0=Duffy&bln1=AND&fld1=YMD_date&val1=&bln2=AND&fld2=doc_body&val2=&sort=YMD_date%3AD&page=0
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';
  } else if ((match = /^\/resources\/doc\/nb\/obit\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://infoweb.newsbank.com/resources/doc/nb/obit/175A318630BE6C90-175A318630BE6C90?p=OBIT
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/iw-search\/we\/Static$/i.exec(path)) !== null) {
    // https://infoweb.newsbank.com/iw-search/we/Static?p_product=Space&f_location=space&p_theme=current&p_action=doc&p_nbid=J50L52JHMTYwMjE4MjIzMC42MDYyNzg6MToxNDoxMzIuMTc0LjI1MC45NQ&f_docnum=17DF632D56E33508&f_topic=1&f_prod=BRFB&f_type=&d_refprod=SPECIALREPORTS
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = param.f_docnum;
  } else if ((match = /^\/apps\/news\/document-view$/i.exec(path)) !== null) {
    // https://infoweb.newsbank.com/apps/news/document-view?p=NewsBank&t=&sort=YMD_date%3AD&fld-base-0=alltext&maxresults=20&val-base-0=H1N1&docref=news/17DFAD1BF786C478
    // https://infoweb.newsbank.com/apps/news/document-view?p=AMNEWS&t=favorite%3A1467499E%21Columbus%2520Dispatch%2520Historical%2520and%2520Current&sort=YMD_date%3AD&fld-base-0=alltext&maxresults=20&val-base-0=Ginther&docref=news/17DED41B89F9D928
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = param.docref.replace('news/', '');
  }

  return result;
});
