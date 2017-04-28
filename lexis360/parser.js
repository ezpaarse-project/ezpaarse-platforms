#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lexis 360
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

  //if ((match = /^\/platform\/path\/to\/(document\-([0-9]+)\-test\.pdf)$/i.exec(path)) !== null) {
  if ((match = /^\/Document\/([\w]+)\/([\w\-]+)$/i.exec(path)) !== null) {
    //http://www.lexis360.fr/Document/droit_fiscal_29_septembre_2016_n_39/EQoofIo2izxXAW-NWTzsDkSV01q3G5HXt9qLfVgetxD6vmamzHEa7qFKMR2TVPp30?data=c0luZGV4PTEmckNvdW50PTE3NjIm&rndNum=869697884&tsid=search7_
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.rndNum;
    let metadata = match[1];
    let match2;
    if ((match2 = /([a-z_]+)_(\d+_\w+_\d+)_n_(\d+)/i.exec(metadata)) !== null) {
      result.title_id = match2[1];
    }
  }

  else if ((match = /^\/Docview.aspx$/i.exec(path)) !== null) {
    // http://www.lexis360.fr/Docview.aspx?&tsid=docview1_&citationData={"citationId":"PS_RDF_201639SOMMAIREPS_2_0KTGS3","title":"545","docId":"PS_RDF_201639SOMMAIREPS_2_0KTG"}
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    let citationData = JSON.parse(param.citationData);
    result.unitid   = citationData.docId;
    result.title_id = citationData.docId.split('_')[1];
  }

//;FP_FP-617751_0KT0;ENCYCLOPAEDIA_ENTRY;HTML;https://webanalytics.lexisnexis.com:443/wa_k4c.watag?js=1&rf=https%3A%2F%2Fwww-lexis360-fr.bases-doc.univ-lorraine.fr%2Fsearch.aspx%3Fpid%3D6%26portletId%3D79%26tsid%3Dportalpage42_&lc=https%3A%2F%2Fwww-lexis360-fr.bases-doc.univ-lorraine.fr%2FDocument%2Fn_3217_preparer_ses_examens%2FZsfF73PHuzboctUxOJMYP2nWRYaEUoe_zWzSfAzjON01%3Fdata%3Dc0luZGV4PTImckNvdW50PTEzJg%3D%3D%26rndNum%3D1099977257%26tsid%3Dsearch20_&rs=1920x1080&cd=24&ln=fr&jv=1&tz=GMT%20%2B01%3A00&site=k4c&wa_PageName=Format%20des%20documents%20&wa_ProductId=69&un=THOMAS.JOUNEAUU2447445205&wa_UserType=Subscribed&wa_SessionId=228945b0-0a48-11e7-af02-00000aab0d6b&wa_ClientID=%23%24%25none%25%24%23&wa_transID=05d9824d-8592-4b02-969c-f9a445500bb9&wa_DocId=FP_FP-617751_0KT0&wa_DocSourceType=FicheMethodo&wa_UserAction=ViewDoc&wa_RequestEndTime=Thu%2C%2016%20Mar%202017%2015%3A57%3A55%20GMT&ets=1489679875173.841&ts=1489679875173.713&ck=WA_ANONCOOKIE%3DZFdM2qWagxa5_44212
//;FP_FP-620713_0KT0;ENCYCLOPAEDIA_ENTRY;HTML;https://webanalytics.lexisnexis.com:443/wa_k4c.watag?js=1&rf=https%3A%2F%2Fwww-lexis360-fr.bases-doc.univ-lorraine.fr%2FContenus&lc=https%3A%2F%2Fwww-lexis360-fr.bases-doc.univ-lorraine.fr%2Fdocview.aspx%3Ftsid%3Dsearch21_&rs=1920x1080&cd=24&ln=fr&jv=1&tz=GMT%20%2B01%3A00&site=k4c&wa_PageName=Format%20des%20documents%20&wa_ProductId=69&un=THOMAS.JOUNEAUU2447445205&wa_UserType=Subscribed&wa_SessionId=228945b0-0a48-11e7-af02-00000aab0d6b&wa_ClientID=%23%24%25none%25%24%23&wa_transID=0768a48d-b571-435d-b4a9-32ab97a14a85&wa_DocId=FP_FP-620713_0KT0&wa_DocSourceType=FicheRevision&wa_UserAction=ViewDoc&wa_RequestEndTime=Thu%2C%2016%20Mar%202017%2016%3A01%3A52%20GMT&ets=1489680112027.152&ts=1489680112027.958&ck=WA_ANONCOOKIE%3DZFdM2qWagxa5_44212

//  else if ((match = /^\/wa_k4c.watag$/i.exec(path)) !== null) {
//    //plateforme webanalytics
//    //https://webanalytics.lexisnexis.com:443/wa_k4c.watag
//    console.error("BING " + param.wa_SessionId + " - " + param.wa_ClientID);
//    //result.unitid = param.wa_DocId;
//
//    if (param.wa_DocSourceType === "FicheMethodo" || param.wa_DocSourceType === "FicheRevision"){
//      result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
//      result.mime     = 'HTML';
//    }
//  }

  return result;
});
