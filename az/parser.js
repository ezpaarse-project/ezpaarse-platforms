#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Aranzadi
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
  let marginal;
  //let match;

  if (/^\/maf\/app\/delivery\/document$/i.test(path)) {
    // http://aranzadi.aranzadidigital.es/maf/app/delivery/document?_=1697747395452&deliveryTarget=save&deliveryType=document&infoType=arz_legis&typeTitle=Legislaci%C3%B3n&magazines=&srguid=i0ad6adc60000018b49a00a26fc754444&td=0&docTitle=Desarrolla+el+Estatuto+del+Trabajo+Aut%C3%B3nomo++(RCL+2007%5C1354)+en+materia+de+contrato+del+trabajador+aut%C3%B3n...&label=Real+Decreto+n%C3%BAm.+197%2F2009%2C+de+23+febrero&docguid=I3407bf608eb111ea98abc16d771da8bc
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.db_id = param._;
    result.unitid = param.docguid;

  } else if (/^\/maf\/app\/document$/i.test(path) && parsedUrl.hostname == 'aranzadi.aranzadidigital.es') {
    if (param.marginal) {
      // http://aranzadi.aranzadidigital.es/maf/app/document?startChunk=1&endChunk=2&stid=marginal_chunk&ds=ARZ_LEGIS_CS&infotype=arz_legis&marginal=RCL\2004\1466&version=&srguid=i0ad6adc60000018b4985c8a0c99bd9dd&lang=spa&src=withinResuts&spos=1&epos=1&mdfilter=mdlegisfilter
      // http://aranzadi.aranzadidigital.es/maf/app/document?startChunk=1&endChunk=2&stid=marginal_chunk&ds=ARZ_LEGIS_CS&infotype=arz_legis&marginal=RCL\1979\2289&version=&srguid=i0ad6adc60000018b4985c8a0c99bd9dd&lang=spa&src=withinResuts&spos=10&epos=10&mdfilter=mdlegisfilter
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      result.unitid = param.marginal;
    } else if (param.docguid) {
      // http://aranzadi.aranzadidigital.es/maf/app/document?docguid=I0aabd1b05e2a11e8a041010000000000&srguid=i0ad6adc60000018b49ab472c81fff954&src=withinResuts&spos=1&epos=1
      // http://aranzadi.aranzadidigital.es/maf/app/document?docguid=I0661f5f02b8a11e1936b010000000000&srguid=i0ad6adc60000018b49ab472c81fff954&src=withinResuts&spos=4&epos=4
      result.rtype    = 'FORMULES';
      result.mime     = 'HTML';
      result.unitid   = param.docguid;
    }
  } else if (/^\/maf\/app\/search\/run$/i.test(path)) {
    // http://aranzadi.aranzadidigital.es/maf/app/search/run?stid=magazines&ds=ARZ_BIBLOS_CS&publicacion=Revista%20de%20Derecho%20Patrimonial&fechacomun=20121231&displayid=actualidad.revista.derecho.patrimonial
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.publicacion;

  } else if (/^\/maf\/app\/search\/run\/multi$/i.test(path)) {
    // http://aranzadi.aranzadidigital.es/maf/app/search/run/multi
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/maf\/app\/document$/i.test(path) && (marginal = param.marginal) != undefined && (marginal.split('\\')[0] === 'RJ' || marginal.split('\\')[0] === 'RCL')) {
    // https://insignis.aranzadidigital.es/maf/app/document?startChunk=1&mdfilter=mdlegisfilter&endChunk=2&stid=marginal_chunk&ds=ARZ_LEGIS_CS&infotype=arz_legis&subResult=i0ad6adc60000018ed0247a839bee5891&docguid=I6b664a40e83811db8079010000000000&marginal=RCL\1999\710&spos=1&epos=1&version=19990406&displayName=&lang=spa
    // https://insignis.aranzadidigital.es/maf/app/document?srguid=i0ad6adc50000018ed0247dc8eb6fe26f&marginal=RJ\2017\1890&docguid=I03fcd8903aa011e79de2010000000000&ds=ARZ_LEGIS_CS&infotype=arz_doc-admin;&spos=1&epos=1&td=0&predefinedRelationshipsType=documentRetrieval&global-result-list=global&fromTemplate=&suggestScreen=&&selectedNodeName=&selec_mod=false&displayName=
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = marginal;
  } else if (/^\/maf\/app\/document$/i.test(path) && (marginal = param.marginal) != undefined && marginal.split('\\')[0] == 'BIB') {
    // https://insignis.aranzadidigital.es/maf/app/document?srguid=i0ad6adc50000018ed0247a19ba6a7861&marginal=BIB\2021\1098&docguid=I2e8fecd0a23611ebaf9ae70e1612b1e3&ds=ARZ_LEGIS_CS&infotype=arz_biblos;&spos=1&epos=1&td=0&predefinedRelationshipsType=documentRetrieval&fromTemplate=&suggestScreen=&&selectedNodeName=&selec_mod=false&displayName=
    // https://insignis.aranzadidigital.es/maf/app/document?srguid=i0ad6adc50000018ed0247a19ba6a7861&marginal=BIB\2015\322&docguid=Idbdd5360a82c11e4b065010000000000&ds=ARZ_LEGIS_CS&infotype=arz_biblos;&spos=5&epos=5&td=0&predefinedRelationshipsType=documentRetrieval&fromTemplate=&suggestScreen=&&selectedNodeName=&selec_mod=false&displayName=
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = marginal;
  } else if (/^\/maf\/app\/document$/i.test(path) && (marginal = param.marginal) != undefined && marginal.split('\\')[0] == 'FOR') {
    // https://insignis.aranzadidigital.es/maf/app/document?srguid=i0ad6adc50000018ed0247c23d3a4bb99&marginal=FOR\2012\839&docguid=I0eb20050b1e111e1847d010000000000&ds=ARZ_LEGIS_CS&infotype=arz_formularios;&spos=1&epos=1&td=0&predefinedRelationshipsType=documentRetrieval&fromTemplate=&suggestScreen=&&selectedNodeName=&selec_mod=false&displayName=
    // https://insignis.aranzadidigital.es/maf/app/document?srguid=i0ad6adc50000018ed0247c23d3a4bb99&marginal=FOR\2011\924&docguid=I55351570de7f11e0a788010000000000&ds=ARZ_LEGIS_CS&infotype=arz_formularios;&spos=8&epos=8&td=0&predefinedRelationshipsType=documentRetrieval&fromTemplate=&suggestScreen=&&selectedNodeName=&selec_mod=false&displayName=
    result.rtype    = 'FORMULES';
    result.mime     = 'HTML';
    result.unitid   = marginal;
  } else if (/^\/maf\/app\/document$/i.test(path) && (marginal = param.marginal) != undefined && marginal.split('\\')[0] == 'MIX') {
    // https://insignis.aranzadidigital.es/maf/app/document?srguid=i0ad6adc50000018ed0247b3d15b13605&marginal=MIX\2023\211717&docguid=Id421ff501ef611eeba5fb46f48ac422d&ds=ARZ_LEGIS_CS&infotype=arz_cuadros;&spos=1&epos=1&td=0&predefinedRelationshipsType=documentRetrieval&fromTemplate=&suggestScreen=&&selectedNodeName=&selec_mod=false&displayName=
    // https://insignis.aranzadidigital.es/maf/app/document?srguid=i0ad6adc50000018ed0247b3d15b13605&marginal=MIX\2004\583&docguid=I4aa5994075a211dba338010000000000&ds=ARZ_LEGIS_CS&infotype=arz_cuadros;&spos=2&epos=2&td=0&predefinedRelationshipsType=documentRetrieval&fromTemplate=&suggestScreen=&&selectedNodeName=&selec_mod=false&displayName=#
    result.rtype    = 'IMAGE';
    result.mime     = 'PDF';
    result.unitid   = marginal;
  }

  return result;
});
