#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lextenso
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  // nouvelle plateforme
  if ((match = /^\/revue(\/([A-Z]+)\/\d+\/\d+)$/.exec(path)) !== null) {
    //https://www.lextenso.fr/revue/BJB/2018/05
    //https://www.lextenso.fr/revue/DFF/2018/39
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1].replace(/\W/gi, '');
    result.title_id = match[2];
    if (result.title_id == 'BJB' || result.title_id == 'JBB') {
      result.print_identifier = '1638-9468';
      result.publication_title = 'Bulletin Joly Bourse';
    }
    else if (result.title_id == 'BJE' || result.title_id == 'JBE') {
      result.print_identifier = '2115-2578';
      result.publication_title = 'Bulletin Joly Entreprises en difficulté';
    }
    else if (result.title_id == 'BJS' || result.title_id == 'JBS') {
      result.print_identifier = '1285-0888';
      result.publication_title = 'Bulletin Joly Sociétés';
    }
    else if (result.title_id == 'BJT' || result.title_id == 'JBT') {
      result.print_identifier = '';
      result.publication_title = 'Bulletin Joly Travail';
    }
    else if (result.title_id == 'CAPJA') {
      result.print_identifier = '2107-5387';
      result.publication_title = 'Cahiers de l\'arbitrage';
    }
    else if (result.title_id == 'CSB') {
      result.print_identifier = '0992-5090';
      result.publication_title = 'Cahiers sociaux';
    }
    else if (result.title_id == 'DEF' || result.title_id == 'AD' || result.title_id == 'QP' || result.title_id == 'JP' || result.title_id == 'CJ' || result.title_id == 'IA' || result.title_id == 'RM') {
      result.print_identifier = '2116-9578';
      result.publication_title = 'Defrénois';
    }
    else if (result.title_id == 'EDBA' || result.title_id == 'DBA') {
      result.print_identifier = '2110-8188';
      result.publication_title = 'Essentiel Droit bancaire';
    }
    else if (result.title_id == 'DDC') {
      result.print_identifier = '2552-0768';
      result.publication_title = 'Essentiel Droit de la distribution et de la concurrence';
    }
    else if (result.title_id == 'EDFP' || result.title_id == 'DFP') {
      result.print_identifier = '2102-3573';
      result.publication_title = 'Essentiel Droit de la famille et des personnes';
    }
    else if (result.title_id == 'EDPI' || result.title_id == 'DPI') {
      result.print_identifier = '2109-2133';
      result.publication_title = 'Essentiel Droit de la propriété intellectuelle';
    }
    else if (result.title_id == 'EDUC' || result.title_id == 'DIU') {
      result.print_identifier = '1969-0649';
      result.publication_title = 'Essentiel Droit de l\'immobilier et urbanisme';
    }
    else if (result.title_id == 'EDAS' || result.title_id == 'DAS') {
      result.print_identifier = '2112-3322';
      result.publication_title = 'Essentiel Droit des assurances';
    }
    else if (result.title_id == 'EDCO' || result.title_id == 'DCO') {
      result.print_identifier = '1961-4942';
      result.publication_title = 'Essentiel Droit des contrats';
    }
    else if (result.title_id == 'EDED' || result.title_id == 'DED') {
      result.print_identifier = '2101-4647';
      result.publication_title = 'Essentiel Droit des entreprises en difficulté';
    }
    else if (result.title_id == 'EDAA' || result.title_id == 'DAA') {
      result.print_identifier = '2552-1381';
      result.publication_title = 'Essentiel Droits africains des affaires';
    }
    else if (result.title_id == 'DFF') {
      result.print_identifier = '2112-776X';
      result.publication_title = 'Flash Defrénois';
    }
    else if (result.title_id == 'GPL') {
      result.print_identifier = '0242-6331';
      result.publication_title = 'Gazette du Palais';
    }
    else if (result.title_id == 'NCCC') {
      result.print_identifier = '2112-2679';
      result.publication_title = 'Nouveaux Cahiers du Conseil constitutionnel';
    }
    else if (result.title_id == 'LPA' || result.title_id == 'PA' || result.title_id == 'QJ') {
      result.print_identifier = '0999-2170';
      result.publication_title = 'Petites Affiches';
    }
    else if (result.title_id == 'RDC') {
      result.print_identifier = '1763-5594';
      result.publication_title = 'Revue des contrats';
    }
    else if (result.title_id == 'RDP') {
      result.print_identifier = '0035-2578';
      result.publication_title = 'Revue du droit public';
    }
    else if (result.title_id == 'RFFP') {
      result.print_identifier = '0294-0833';
      result.publication_title = 'Revue française de finances publiques';
    }
    else if (result.title_id == 'RGA') {
      result.print_identifier = '1273-3407';
      result.publication_title = 'Revue générale du droit des assurances';
    }
  }

  else if ((match = /^\/jurisprudence\/(([A-Z]+).+)$/.exec(path)) !== null) {
    //https://www.lextenso.fr/jurisprudence/CONSTEXT000031256027
    //https://www.lextenso.fr/jurisprudence/CAPARIS-18042013-10_21459
    result.rtype    = 'JURISPRUDENCE';
    result.mime     = 'HTML';
    result.unitid   = match[1].replace(/\W/gi, '');
    result.title_id = match[2];
  }

  else if ((match = /^\/[^magazine-issues][a-z-]+\/(([A-Z]+).+)$/.exec(path)) !== null) {
    //https://www.lextenso.fr/lessentiel-droit-des-contrats/EDCO-116023-11602
    //https://www.lextenso.fr/petites-affiches/PA199902103
    //https://www.lextenso.fr/petites-affiches/PA201602202
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1].replace(/\W/gi, '');
    result.title_id = match[2];
    if (result.title_id == 'BJB' || result.title_id == 'JBB') {
      result.print_identifier = '1638-9468';
      result.publication_title = 'Bulletin Joly Bourse';
    }
    else if (result.title_id == 'BJE' || result.title_id == 'JBE') {
      result.print_identifier = '2115-2578';
      result.publication_title = 'Bulletin Joly Entreprises en difficulté';
    }
    else if (result.title_id == 'BJS' || result.title_id == 'JBS') {
      result.print_identifier = '1285-0888';
      result.publication_title = 'Bulletin Joly Sociétés';
    }
    else if (result.title_id == 'BJT' || result.title_id == 'JBT') {
      result.print_identifier = '';
      result.publication_title = 'Bulletin Joly Travail';
    }
    else if (result.title_id == 'CAPJA') {
      result.print_identifier = '2107-5387';
      result.publication_title = 'Cahiers de l\'arbitrage';
    }
    else if (result.title_id == 'CSB') {
      result.print_identifier = '0992-5090';
      result.publication_title = 'Cahiers sociaux';
    }
    else if (result.title_id == 'DEF' || result.title_id == 'AD' || result.title_id == 'QP' || result.title_id == 'JP' || result.title_id == 'CJ' || result.title_id == 'IA' || result.title_id == 'RM') {
      result.print_identifier = '2116-9578';
      result.publication_title = 'Defrénois';
    }
    else if (result.title_id == 'EDBA' || result.title_id == 'DBA') {
      result.print_identifier = '2110-8188';
      result.publication_title = 'Essentiel Droit bancaire';
    }
    else if (result.title_id == 'DDC') {
      result.print_identifier = '2552-0768';
      result.publication_title = 'Essentiel Droit de la distribution et de la concurrence';
    }
    else if (result.title_id == 'EDFP' || result.title_id == 'DFP') {
      result.print_identifier = '2102-3573';
      result.publication_title = 'Essentiel Droit de la famille et des personnes';
    }
    else if (result.title_id == 'EDPI' || result.title_id == 'DPI') {
      result.print_identifier = '2109-2133';
      result.publication_title = 'Essentiel Droit de la propriété intellectuelle';
    }
    else if (result.title_id == 'EDUC' || result.title_id == 'DIU') {
      result.print_identifier = '1969-0649';
      result.publication_title = 'Essentiel Droit de l\'immobilier et urbanisme';
    }
    else if (result.title_id == 'EDAS' || result.title_id == 'DAS') {
      result.print_identifier = '2112-3322';
      result.publication_title = 'Essentiel Droit des assurances';
    }
    else if (result.title_id == 'EDCO' || result.title_id == 'DCO') {
      result.print_identifier = '1961-4942';
      result.publication_title = 'Essentiel Droit des contrats';
    }
    else if (result.title_id == 'EDED' || result.title_id == 'DED') {
      result.print_identifier = '2101-4647';
      result.publication_title = 'Essentiel Droit des entreprises en difficulté';
    }
    else if (result.title_id == 'EDAA' || result.title_id == 'DAA') {
      result.print_identifier = '2552-1381';
      result.publication_title = 'Essentiel Droits africains des affaires';
    }
    else if (result.title_id == 'DFF') {
      result.print_identifier = '2112-776X';
      result.publication_title = 'Flash Defrénois';
    }
    else if (result.title_id == 'GPL') {
      result.print_identifier = '0242-6331';
      result.publication_title = 'Gazette du Palais';
    }
    else if (result.title_id == 'NCCC') {
      result.print_identifier = '2112-2679';
      result.publication_title = 'Nouveaux Cahiers du Conseil constitutionnel';
    }
    else if (result.title_id == 'LPA' || result.title_id == 'PA' || result.title_id == 'QJ') {
      result.print_identifier = '0999-2170';
      result.publication_title = 'Petites Affiches';
    }
    else if (result.title_id == 'RDC') {
      result.print_identifier = '1763-5594';
      result.publication_title = 'Revue des contrats';
    }
    else if (result.title_id == 'RDP') {
      result.print_identifier = '0035-2578';
      result.publication_title = 'Revue du droit public';
    }
    else if (result.title_id == 'RFFP') {
      result.print_identifier = '0294-0833';
      result.publication_title = 'Revue française de finances publiques';
    }
    else if (result.title_id == 'RGA') {
      result.print_identifier = '1273-3407';
      result.publication_title = 'Revue générale du droit des assurances';
    }
  }

  return result;
});
