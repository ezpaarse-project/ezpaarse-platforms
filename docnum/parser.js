#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 200*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /^\/(public|prive)\/((UPV\-M)\/(Theses|Masters|DiplomeEtat)\/(\d{4}|[a-zA-Z]+)\/(.*\.pdf))$/.exec(path)) !== null) {
    // /public/UPV-M/Theses/2005/Germain.Lionel.SMZ0518.pdf
    // UPV-M/Masters/2010/Musicologie_B.HAUG.pdf
    // UPV-M/DiplomeEtat/Puericultrices/Calmes.Sophie.MZ0701.pdf
    //console.error(match);
    result.institution = match[3];
    if (match[4] == 'Theses') { result.rtype = 'PHD_THESIS'; }
    else if (match[4] == 'Masters') { result.rtype = 'MASTER_THESIS'; }
    else if (match[4] == 'DiplomeEtat') { result.rtype = 'MD_MEMOIRE'; }
    result.mime  = 'PDF';
    result.unitid = match[2];
    if ( /\d{4}/.test(match[5]) ) { result.year = match[5]; }
    else { result.discipline = match[5]; }
    result.title_id = match[6];
  } else if ((match = /^\/(public|prive)\/(INPL_(T_)?(\d{4})(.*\.pdf))$/.exec(path)) !== null) {
    // /public/INPL_T_2003_KRUPA_A.pdf
    result.institution = 'INPL';
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[2];
    result.year = match[4];
    result.title_id = match[2];
  } else if ((match = /^\/(public|prive)\/(INPL\/(\d{4}).*\.pdf)$/.exec(path)) !== null) {
    // /public/INPL/2009_ARMAGHAN_N.pdf
    result.institution = 'INPL';
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[2];
    result.year = match[3];
    result.title_id = match[2];
  } else if ((match = /^\/(public|prive)\/(NANCY2\/doc\d+\/(\d{4})NAN2\d+([\-_].+)?\.pdf)$/.exec(path)) !== null) {
  //NANCY2, uniquement thèses de doctorat

    // /public/NANCY2/doc480/2010NAN20015-1.pdf
    // /public/NANCY2/doc251/2006NAN21003_1.pdf
    // /public/NANCY2/doc408/2008NAN20005-opt.pdf
    // /public/NANCY2/doc213/2001NAN21019_corpus6.pdf
    result.institution = 'NANCY2';
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[2];
    result.year = match[3];
    result.title_id = match[2];
  } else if ((match = /^\/(public|prive)\/(SCD_T_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
      //thèse doctorat UHP

    // /public/SCD_T_2011_0134_KATRIB.pdf
    result.institution = 'UHP';
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.year = match[3];
    result.title_id = match[2];
    result.unitid = match[2];
  } else if ((match = /^\/(public|prive)\/(DDOC_T_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
  //thèse de doctorat UL

    // /public/DDOC_T_2012_0374_CECCARELLI.pdf
    result.institution = 'UL';
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.year = match[3];
    result.title_id = match[2];
    result.unitid = match[2];
  } else if ((match = /^\/(public|prive)\/((SCDPHA|SCDMED)_TD?_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
  //these d'exercice UHP

    // /public/SCDMED_T_2010_CRIVELLI_DOROTHEE.pdf
    // /public/SCDPHA_T_2009_DRIAD_YACINE.pdf
    // /public/SCDPHA_TD_2007_MARTIN_HELENE.pdf
    result.institution = 'UHP';
    result.rtype = 'MD_THESIS';
    result.mime  = 'PDF';
    result.year = match[4];
    result.title_id = match[2];
    result.unitid = match[2];
  } else if ((match = /^\/(public|prive)\/((BUPHA|BUMED)_TD?_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
  //these d'exercice UL

    // /public/BUMED_T_2013_GAUD_SIMON.pdf
    // /public/BUPHA_T_2012_AIZIER_EMILIE.pdf
    result.institution = 'UL';
    result.rtype = 'MD_THESIS';
    result.mime  = 'PDF';
    result.year = match[4];
    result.title_id = match[2];
    result.unitid = match[2];
  } else if ((match = /^\/(public|prive)\/((SCDPHA|SCDMED|SCDSCI|SCDENS)_(CNAM|HDR|MAUDIO|M|MESF|MIBODE|MINF|MING|MORT)_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
  //UHP, tout sauf thèses d'exercice ou de doctorat

    // /public/SCDMED_MESF_2011_MARTIN_ANNELAURE.pdf
    // /public/SCDSCI_M_2011_PICAUDE_MATHIEU.pdf
    // /public/SCDMED_MORT_2010_MAURICE_BOULANGER_STEPHANIE.pdf
    result.institution = 'UHP';
    if ( match[4] == 'MAUDIO' || match[4] == 'MESF' || match[4] == 'MIBODE' || match[4] == 'MINF' || match[4] == 'MORT' ){
      result.rtype = 'MD_MEMOIRE';
    } else if (match[4] == 'HDR'){
      result.rtype = 'HABILITATION_THESIS';
    } else if ( match[4] == 'M' || match[4] == 'MING' || match[4] == 'CNAM' ){
      result.rtype = 'MASTER_THESIS';
    }
    result.mime  = 'PDF';
    result.year = match[5];
    result.title_id = match[2];
    result.unitid = match[2];
  } else if ((match = /^\/(public|prive)\/((BUPHA|BUMED|BUS|BUD|BUL|BUG|BUM|BUE|BUIUFM)_(CNAM|HDR|MAUDIO|M|MESF|MIBODE|MINF|MING|MORT|MSPM)_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
  //UL, tout sauf thèses d'exercice ou de doctorat

    // /public/BUE_MING_2012_CHAMPILOU_VINCENT_COUTANT_BASTIEN.pdf
    // /public/BUMED_MESF_2013_BIBLOT_PHILIPPINE.pdf
    result.institution = 'UL';
    if ( match[4] == 'MAUDIO' ||
         match[4] == 'MESF' ||
         match[4] == 'MIBODE' ||
         match[4] == 'MINF' ||
         match[4] == 'MORT' ) {
      result.rtype = 'MD_MEMOIRE';
    } else if (match[4] == 'HDR'){
      result.rtype = 'HABILITATION_THESIS';
    } else if ( match[4] == 'M' ||
                match[4] == 'MING' ||
                match[4] == 'CNAM' ){
      result.rtype = 'MASTER_THESIS';
    } else {
      result.rtype = match[4];
    }
    result.mime  = 'PDF';
    result.year = match[5];
    result.title_id = match[2];
    result.unitid = match[2];
  } else if ((match = /^\/(pulsar)\/(.*\.pdf)$/.exec(path)) !== null) {
    result.institution = 'UL';
    result.mime  = 'PDF';
    result.rtype = match[1].toUpperCase();
    result.title_id = match[2];
    result.unitid = match[2];
  }

  return result;
});
