#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /^\/public\/(UPV\-M\/Theses\/(\d{4})\/(.*\.pdf))$/.exec(path)) !== null) {
    // /public/UPV-M/Theses/2005/Germain.Lionel.SMZ0518.pdf
    result.institution = 'UPV-M';
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[2];
    result.title_id = match[3];
  }
  if ((match = /^\/public\/(UPV\-M\/Masters\/(\d{4})\/(.*\.pdf))$/.exec(path)) !== null) {
    // UPV-M/Masters/2010/Musicologie_B.HAUG.pdf
    result.institution = 'UPV-M';
    result.rtype = 'MASTER_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[2];
    result.title_id = match[3];
  }
  if ((match = /^\/public\/(UPV\-M\/DiplomeEtat\/(.*)\/(.*\.pdf))$/.exec(path)) !== null) {
    // UPV-M/DiplomeEtat/Puericultrices/Calmes.Sophie.MZ0701.pdf
    result.institution = 'UPV-M';
    result.rtype = 'MD_MEMOIRE';
    result.mime  = 'PDF';
    result.title_id = match[3];
    result.unitid = match[1];
    result.discipline = match[2];
  } 

  if ((match = /^\/public\/(INPL_(T_)?(\d{4})(.*\.pdf))$/.exec(path)) !== null) {
    // /public/INPL_T_2003_KRUPA_A.pdf
    result.institution = 'INPL';
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[3];
    result.title_id = match[1];
  }

  if ((match = /^\/public\/(INPL\/(\d{4}).*\.pdf)$/.exec(path)) !== null) {
    // /public/INPL/2009_ARMAGHAN_N.pdf
    result.institution = 'INPL';
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[2];
    result.title_id = match[1];
  }

  //NANCY2, uniquement thèses de doctorat
  if ((match = /^\/public\/(NANCY2\/doc\d+\/(\d{4})NAN2\d+([\-_].+)?\.pdf)$/.exec(path)) !== null) {
    // /public/NANCY2/doc271/2005NAN21008.pdf
    // /public/NANCY2/doc480/2010NAN20015-1.pdf
    // /public/NANCY2/doc251/2006NAN21003_1.pdf
    // /public/NANCY2/doc408/2008NAN20005-opt.pdf
    // /public/NANCY2/doc213/2001NAN21019_corpus6.pdf
    result.institution = 'NANCY2';
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[2];
    result.title_id = match[1];
  }

  //thèse doctorat UHP
  if ((match = /^\/public\/(SCD_T_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
    // /public/SCD_T_2011_0134_KATRIB.pdf
    result.institution = 'UHP';  
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.year = match[2];
    result.title_id = match[1];
    result.unitid = match[1];
  } 

  //thèse de doctorat UL
  if ((match = /^\/public\/(DDOC_T_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
    // /public/DDOC_T_2012_0374_CECCARELLI.pdf
    result.institution = 'UL';  
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.year = match[2];
    result.title_id = match[1];
    result.unitid = match[1];
  } 
  //these d'exercice UHP
  if ((match = /^\/public\/((SCDPHA|SCDMED)_TD?_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
    // /public/SCDMED_T_2010_CRIVELLI_DOROTHEE.pdf
    // /public/SCDPHA_T_2009_DRIAD_YACINE.pdf
    // /public/SCDPHA_TD_2007_MARTIN_HELENE.pdf
    result.institution = 'UHP';  
    result.rtype = 'MD_THESIS';
    result.mime  = 'PDF';
    result.year = match[3];
    result.title_id = match[1];
    result.unitid = match[1];
  } 

  //these d'exercice UL
  if ((match = /^\/public\/((BUPHA|BUMED)_TD?_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
    // /public/BUMED_T_2013_GAUD_SIMON.pdf
    // /public/BUPHA_T_2012_AIZIER_EMILIE.pdf
    result.institution = 'UL';  
    result.rtype = 'MD_THESIS';
    result.mime  = 'PDF';
    result.year = match[3];
    result.title_id = match[1];
    result.unitid = match[1];
  } 

  //UHP, tout sauf thèses d'exercice ou de doctorat
  if ((match = /^\/public\/((SCDPHA|SCDMED|SCDSCI|SCDENS)_(CNAM|HDR|MAUDIO|M|MESF|MIBODE|MINF|MING|MORT)_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
    // /public/SCDMED_MESF_2011_MARTIN_ANNELAURE.pdf
    // /public/SCDSCI_M_2011_PICAUDE_MATHIEU.pdf
    // /public/SCDMED_MORT_2010_MAURICE_BOULANGER_STEPHANIE.pdf
    result.institution = 'UHP';  
    if ( match[3] == 'MAUDIO' || match[3] == 'MESF' || match[3] == 'MIBODE' || match[3] == 'MINF' || match[3] == 'MORT' ){    
      result.rtype = 'MD_MEMOIRE';
    } else if (match[3] == 'HDR'){
      result.rtype = 'HABILITATION_THESIS';
    } else if ( match[3] == 'M' || match[3] == 'MING' || match[3] == 'CNAM' ){
      result.rtype = 'MASTER_THESIS';
    }
    result.mime  = 'PDF';
    result.year = match[4];
    result.title_id = match[1];
    result.unitid = match[1];
  } 

  //UL, tout sauf thèses d'exercice ou de doctorat
  if ((match = /^\/public\/((BUPHA|BUMED|BUS|BUD|BUL|BUG|BUM|BUE|BUIUFM)_(CNAM|HDR|MAUDIO|M|MESF|MIBODE|MINF|MING|MORT)_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
    // /public/BUE_MING_2012_CHAMPILOU_VINCENT_COUTANT_BASTIEN.pdf
    // /public/BUMED_MESF_2013_BIBLOT_PHILIPPINE.pdf
    result.institution = 'UL';  
    if ( match[3] == 'MAUDIO' || match[3] == 'MESF' || match[3] == 'MIBODE' || match[3] == 'MINF' || match[3] == 'MORT' ){    
      result.rtype = 'MD_MEMOIRE';
    } else if (match[3] == 'HDR'){
      result.rtype = 'HABILITATION_THESIS';
    } else if ( match[3] == 'M' || match[3] == 'MING' || match[3] == 'CNAM' ){
      result.rtype = 'MASTER_THESIS';
    }
    result.mime  = 'PDF';
    result.year = match[4];
    result.title_id = match[1];
    result.unitid = match[1];
  } 

  return result;
});
