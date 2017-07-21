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
  let param  = parsedUrl.query || {};
  let rawUrl = ec.url;
  let match;

  //if ((match = /^\/platform\/path\/to\/(document\-([0-9]+)\-test\.pdf)$/i.exec(path)) !== null) {
  if ((match = /^\/Document\/([\w]+)\/([\w-]+)$/i.exec(path)) !== null) {
    // http://www.lexis360.fr/Document/droit_fiscal_29_septembre_2016_n_39/EQoofIo2izxXAW-NWTzsDkSV01q3G5HXt9qLfVgetxD6vmamzHEa7qFKMR2TVPp30?data=c0luZGV4PTEmckNvdW50PTE3NjIm&rndNum=869697884&tsid=search7_
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = param.rndNum;

    if ((match = /([a-z_]+)_(\d+_\w+_\d+)_n_(\d+)/i.exec(match[1])) !== null) {
      result.title_id = match[1];
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

  else if ((match = /^\/wa_k4c.watag$/i.exec(path)) !== null) {
    // plateforme webanalytics : on travaille avec l'URL brute, non parsée
    let match3;
    if ((match3 = /&wa_DocId=([0-9a-zA-Z_-]+)&/i.exec(rawUrl)) !== null) {
      result.unitid = match3[1];
      let match3a;
      if ((match3a = /PS_([A-Z]+)/.exec(result.unitid)) !== null) {
        result.title_id = match3a[1];
      }
    }

    let match4;
    if ((match4 = /&wa_DocSourceType=([0-9a-z%é_]+)&/i.exec(rawUrl)) !== null) {

      let docSourceType = match4[1];
      if (docSourceType === 'FicheMethodo' || docSourceType === 'FicheRevision') {
        result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
        result.mime     = 'HTML';
      }
      else if (docSourceType === 'PresseSommaire') {
        result.rtype    = 'TOC';
        result.mime     = 'HTML';
      }
      else if (docSourceType === 'Presse') {
        result.rtype    = 'ARTICLE';
        result.mime     = 'HTML';
      }
      else if (docSourceType === 'En_eFascicule') {
        let match5;
        if ((match5 = /&wa_UserAction=([a-zA-Z]+)&/i.exec(rawUrl)) !== null) {
          let userAction = match5[1];
          if (userAction === 'ViewDoc' || userAction === 'ChangeToc') {
            result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
            result.mime     = 'HTML';
          }
        }
      }

      if (/L[é%C3A9]+gislationconsolid[é%C3A9]+e/.test(docSourceType)) {
        // https://webanalytics.lexisnexis.com:443/
        // wa_k4c.watag?js=1
        // &rf=https%3A%2F%2Fwww-lexis360-fr.bases-doc.univ-lorraine.fr%2FContenus
        // &lc=https%3A%2F%2Fwww-lexis360-fr.bases-doc.univ-lorraine.fr%2Fdocview.aspx%3Ftsid%3Dsearch25_
        // &rs=1920x1080
        // &cd=24
        // &ln=fr
        // &jv=1
        // &tz=GMT%20%2B01%3A00
        // &site=k4c
        // &wa_PageName=Format%20des%20documents%20
        // &wa_ProductId=69
        // &un=xxxxxxxxxxxxxxxxxxxxxxx
        // &wa_UserType=Subscribed
        // &wa_SessionId=228945b0-0a48-11e7-af02-00000aab0d6b
        // &wa_ClientID=%23%24%25none%25%24%23
        // &wa_transID=bd42b88b-50c4-4672-a9e5-646773b61dd2
        // &wa_DocId=LG_SLD-LEGISCTA000032227360_0WJN
        // &wa_DocSourceType=L%C3%A9gislationconsolid%C3%A9e
        // &wa_UserAction=ViewDoc
        // &wa_RequestEndTime=Thu%2C%2016%20Mar%202017%2016%3A22%3A21%20GMT
        // &ets=1489681341375.843
        // &ts=1489681341375.264
        // &ck=WA_ANONCOOKIE%3DZFdM2qWagxa5_44212
        let match6;
        if ((match6 = /&wa_UserAction=([a-zA-Z]+)&/i.exec(rawUrl)) !== null) {
          let userAction = match6[1];

          if (userAction === 'ViewDoc' || userAction === 'ChangeToc') {
            result.rtype = 'CODES';
            result.mime  = 'HTML';
          }
        }
      }
    }
  }
  return result;
});
