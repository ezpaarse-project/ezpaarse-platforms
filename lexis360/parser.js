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
  let rawUrl = ec.url;

  // use console.error for debuging
  // console.error(parsedUrl);
  //console.error('rawUrl: ' + rawUrl);

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

  else if ((match = /^\/wa_k4c.watag$/i.exec(path)) !== null) {
    //plateforme webanalytics : on travaille avec l'URL brute, non parsée
    let match3;
    if ((match3 = /&wa_DocId=([0-9a-zA-Z_\-]+)&/i.exec(rawUrl)) !== null){
      result.unitid = match3[1];
      let match3a;
      if ((match3a = /PS_([A-Z]+)/.exec(result.unitid)) !== null){
        result.title_id = match3a[1];
      }
    }

    let match4;
    let matchLegislation;
    if ((match4 = /&wa_DocSourceType=([0-9a-z%é_]+)&/i.exec(rawUrl)) !== null){
      let docSourceType = match4[1];
      if (docSourceType === 'FicheMethodo' || docSourceType === 'FicheRevision'){
        result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
        result.mime     = 'HTML';
      }
      else if (docSourceType === 'PresseSommaire'){
        result.rtype    = 'TOC';
        result.mime     = 'HTML';
      }
      else if (docSourceType === 'Presse'){
        result.rtype    = 'ARTICLE';
        result.mime     = 'HTML';
      }
      else if (docSourceType === 'En_eFascicule'){
        let match5;
        if ((match5 = /&wa_UserAction=([a-zA-Z]+)&/i.exec(rawUrl)) !== null){
          let userAction = match5[1];
          if (userAction === 'ViewDoc' || userAction === 'ChangeToc'){
            result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
            result.mime     = 'HTML';
          }
        }
      }
      else if ((matchLegislation = /L[é%C3A9]+gislationconsolid[é%C3A9]+e/.exec(docSourceType)) !== null){
        let match6;
        if ((match6 = /&wa_UserAction=([a-zA-Z]+)&/i.exec(rawUrl)) !== null){
          let userAction = match6[1];
          if (userAction === 'ViewDoc' || userAction === 'ChangeToc'){
            result.rtype    = 'CODES';
            result.mime     = 'HTML';
          }
        }
      }
    }
  }
  return result;
});
