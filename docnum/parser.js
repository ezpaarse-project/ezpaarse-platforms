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
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[2];
    result.title_id = match[3];
  }
  if ((match = /^\/public\/(UPV\-M\/Masters\/(\d{4})\/(.*\.pdf))$/.exec(path)) !== null) {
    // UPV-M/Masters/2010/Musicologie_B.HAUG.pdf
    result.rtype = 'MASTER_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[2];
    result.title_id = match[3];
  }
  if ((match = /^\/public\/(UPV\-M\/DiplomeEtat\/(.*\.pdf))$/.exec(path)) !== null) {
    // UPV-M/DiplomeEtat/Puericultrices/Calmes.Sophie.MZ0701.pdf
    result.rtype = 'MD_THESIS';
    result.mime  = 'PDF';
    result.title_id = match[2];
    result.unitid = match[1];
  } 

  if ((match = /^\/public\/(INPL_(T_)?(\d{4})(.*\.pdf))$/.exec(path)) !== null) {
    // /public/INPL_T_2003_KRUPA_A.pdf
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[3];
    result.title_id = match[1];
  }

  if ((match = /^\/public\/(INPL\/(\d{4}).*\.pdf)$/.exec(path)) !== null) {
    // /public/INPL/2009_ARMAGHAN_N.pdf
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[2];
    result.title_id = match[1];
  }


  if ((match = /^\/public\/(NANCY2\/doc\d+\/(\d{4})NAN2\d+([\-_].+)?\.pdf)$/.exec(path)) !== null) {
    // /public/NANCY2/doc271/2005NAN21008.pdf
    // /public/NANCY2/doc480/2010NAN20015-1.pdf
    // /public/NANCY2/doc251/2006NAN21003_1.pdf
    // /public/NANCY2/doc408/2008NAN20005-opt.pdf
    // /public/NANCY2/doc213/2001NAN21019_corpus6.pdf
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.unitid = match[1];
    result.year = match[2];
    result.title_id = match[1];
  }

  if ((match = /^\/public\/((SCD|DDOC)_T_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
    // /public/DDOC_T_2012_0374_CECCARELLI.pdf
    // /public/SCD_T_2011_0134_KATRIB.pdf
    result.rtype = 'PHD_THESIS';
    result.mime  = 'PDF';
    result.year = match[3];
    result.title_id = match[1];
    result.unitid = match[1];
  } 

  if ((match = /^\/public\/((SCDPHA|BUPHA|SCDMED|BUMED)_TD?_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
    // /public/SCDMED_T_2010_CRIVELLI_DOROTHEE.pdf
    // /public/BUMED_T_2013_GAUD_SIMON.pdf
    // /public/BUPHA_T_2012_AIZIER_EMILIE.pdf
    // /public/SCDPHA_T_2009_DRIAD_YACINE.pdf
    // /public/SCDPHA_TD_2007_MARTIN_HELENE.pdf
    result.rtype = 'MD_THESIS';
    result.mime  = 'PDF';
    result.year = match[3];
    result.title_id = match[1];
    result.unitid = match[1];
  } 

  //TODO : validate (and distinguish between) the different types of Masters thesis if necessary ?
  if ((match = /^\/public\/([A-Z]+_M[A-Z]*_(\d{4})_(.*\.pdf))$/.exec(path)) !== null) {
    // /public/SCDMED_MESF_2011_MARTIN_ANNELAURE.pdf
    // /public/SCDSCI_M_2011_PICAUDE_MATHIEU.pdf
    // /public/BUE_MING_2012_CHAMPILOU_VINCENT_COUTANT_BASTIEN.pdf
    // /public/BUMED_MESF_2013_BIBLOT_PHILIPPINE.pdf
    // /public/SCDMED_MORT_2010_MAURICE_BOULANGER_STEPHANIE.pdf
    result.rtype = 'MASTER_THESIS';
    result.mime  = 'PDF';
    result.year = match[2];
    result.title_id = match[1];
    result.unitid = match[1];
  }   

  return result;
});
