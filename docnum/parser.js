#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/(public|prive)\/((UPV-M)\/(Theses|Masters|DiplomeEtat)\/(\d{4}|[a-zA-Z]+)\/(.*))\.pdf$/i.exec(path)) !== null) {
    // /public/UPV-M/Theses/2005/Germain.Lionel.SMZ0518.pdf
    // UPV-M/Masters/2010/Musicologie_B.HAUG.pdf
    // UPV-M/DiplomeEtat/Puericultrices/Calmes.Sophie.MZ0701.pdf
    result.mime        = 'PDF';
    result.unitid      = match[2];
    result.institution = match[3];
    result.title_id    = match[6];

    switch (match[4].toLowerCase()) {
    case 'theses':
      result.rtype = 'PHD_THESIS';
      break;
    case 'masters':
      result.rtype = 'MASTER_THESIS';
      break;
    case 'diplomeetat':
      result.rtype = 'MD_MEMOIRE';
      break;
    }

    if (/\d{4}/.test(match[5])) {
      result.year = match[5];
    } else {
      result.discipline = match[5];
    }

  } else if ((match = /^\/(public|prive)\/(INPL_(T_)?(\d{4})(.*))\.pdf$/i.exec(path)) !== null) {
    // /public/INPL_T_2003_KRUPA_A.pdf
    result.institution = 'INPL';
    result.rtype       = 'PHD_THESIS';
    result.mime        = 'PDF';
    result.unitid      = match[2];
    result.year        = match[4];
    result.title_id    = match[2];

  } else if ((match = /^\/(public|prive)\/(INPL\/(\d{4}).*)\.pdf$/i.exec(path)) !== null) {
    // /public/INPL/2009_ARMAGHAN_N.pdf
    result.institution = 'INPL';
    result.rtype       = 'PHD_THESIS';
    result.mime        = 'PDF';
    result.unitid      = match[2];
    result.year        = match[3];
    result.title_id    = match[2];

  } else if ((match = /^\/(public|prive)\/(NANCY2\/doc\d+\/(\d{4})NAN2\d+([-_].+)?)\.pdf$/i.exec(path)) !== null) {
    // NANCY2, uniquement thèses de doctorat
    // /public/NANCY2/doc480/2010NAN20015-1.pdf
    // /public/NANCY2/doc251/2006NAN21003_1.pdf
    // /public/NANCY2/doc408/2008NAN20005-opt.pdf
    // /public/NANCY2/doc213/2001NAN21019_corpus6.pdf
    result.institution = 'NANCY2';
    result.rtype       = 'PHD_THESIS';
    result.mime        = 'PDF';
    result.unitid      = match[2];
    result.year        = match[3];
    result.title_id    = match[2];

  } else if ((match = /^\/(public|prive)\/(SCD_T_(\d{4})_(.*))\.pdf$/i.exec(path)) !== null) {
    // thèse doctorat UHP
    // /public/SCD_T_2011_0134_KATRIB.pdf
    result.institution = 'UHP';
    result.rtype       = 'PHD_THESIS';
    result.mime        = 'PDF';
    result.year        = match[3];
    result.title_id    = match[2];
    result.unitid      = match[2];

  } else if ((match = /^\/(public|prive)\/(DDOC_T_(\d{4})_(.*))\.pdf$/i.exec(path)) !== null) {
    // thèse de doctorat UL
    // /public/DDOC_T_2012_0374_CECCARELLI.pdf
    result.institution = 'UL';
    result.rtype       = 'PHD_THESIS';
    result.mime        = 'PDF';
    result.year        = match[3];
    result.title_id    = match[2];
    result.unitid      = match[2];

  } else if ((match = /^\/(public|prive)\/((SCDPHA|SCDMED)_TD?_(\d{4})_(.*))\.pdf$/i.exec(path)) !== null) {
    // these d'exercice UHP
    // /public/SCDMED_T_2010_CRIVELLI_DOROTHEE.pdf
    // /public/SCDPHA_T_2009_DRIAD_YACINE.pdf
    // /public/SCDPHA_TD_2007_MARTIN_HELENE.pdf
    result.institution = 'UHP';
    result.rtype       = 'MD_THESIS';
    result.mime        = 'PDF';
    result.year        = match[4];
    result.title_id    = match[2];
    result.unitid      = match[2];

  } else if ((match = /^\/(public|prive)\/((BUPHA|BUMED)_TD?_(\d{4})_(.*))\.pdf$/i.exec(path)) !== null) {
    // these d'exercice UL
    // /public/BUMED_T_2013_GAUD_SIMON.pdf
    // /public/BUPHA_T_2012_AIZIER_EMILIE.pdf
    result.institution = 'UL';
    result.rtype       = 'MD_THESIS';
    result.mime        = 'PDF';
    result.year        = match[4];
    result.title_id    = match[2];
    result.unitid      = match[2];

  } else if ((match = /^\/(public|prive)\/((SCDPHA|SCDMED|SCDSCI|SCDENS)_(CNAM|HDR|MAUDIO|M|MESF|MIBODE|MINF|MING|MORT)_(\d{4})_(.*))\.pdf$/i.exec(path)) !== null) {
    // UHP, tout sauf thèses d'exercice ou de doctorat
    // /public/SCDMED_MESF_2011_MARTIN_ANNELAURE.pdf
    // /public/SCDSCI_M_2011_PICAUDE_MATHIEU.pdf
    // /public/SCDMED_MORT_2010_MAURICE_BOULANGER_STEPHANIE.pdf
    result.institution = 'UHP';
    result.mime        = 'PDF';
    result.year        = match[5];
    result.title_id    = match[2];
    result.unitid      = match[2];

    switch (match[4]) {
    case 'MAUDIO':
    case 'MESF':
    case 'MIBODE':
    case 'MINF':
    case 'MORT':
      result.rtype = 'MD_MEMOIRE';
      break;
    case 'M':
    case 'MING':
    case 'CNAM':
      result.rtype = 'MASTER_THESIS';
      break;
    case 'HDR':
      result.rtype = 'HABILITATION_THESIS';
      break;
    }
  } else if ((match = /^\/(public|prive)\/((BUPHA|BUMED|BUS|BUD|BUL|BUG|BUM|BUE|BUIUFM)_(CNAM|HDR|MAUDIO|M|MESF|MIBODE|MINF|MING|MORT|MSPM)_(\d{4})_(.*))\.pdf$/i.exec(path)) !== null) {
    // UL, tout sauf thèses d'exercice ou de doctorat
    // /public/BUE_MING_2012_CHAMPILOU_VINCENT_COUTANT_BASTIEN.pdf
    // /public/BUMED_MESF_2013_BIBLOT_PHILIPPINE.pdf
    result.institution = 'UL';
    result.mime        = 'PDF';
    result.year        = match[5];
    result.title_id    = match[2];
    result.unitid      = match[2];

    switch (match[4]) {
    case 'MAUDIO':
    case 'MESF':
    case 'MIBODE':
    case 'MINF':
    case 'MORT':
      result.rtype = 'MD_MEMOIRE';
      break;
    case 'M':
    case 'MING':
    case 'CNAM':
      result.rtype = 'MASTER_THESIS';
      break;
    case 'HDR':
      result.rtype = 'HABILITATION_THESIS';
      break;
    default:
      result.rtype = match[4];
    }
  } else if ((match = /^\/pulsar\/(.*)\.pdf$/i.exec(path)) !== null) {
    result.institution = 'UL';
    result.mime        = 'PDF';
    result.rtype       = 'PULSAR';
    result.title_id    = match[1];
    result.unitid      = match[1];
  }

  return result;
});
