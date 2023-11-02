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

  //let match;

  if (/^\/maf\/app\/delivery\/document$/i.test(path)) {
    // http://aranzadi.aranzadidigital.es/maf/app/delivery/document?_=1697747395452&deliveryTarget=save&deliveryType=document&infoType=arz_legis&typeTitle=Legislaci%C3%B3n&magazines=&srguid=i0ad6adc60000018b49a00a26fc754444&td=0&docTitle=Desarrolla+el+Estatuto+del+Trabajo+Aut%C3%B3nomo++(RCL+2007%5C1354)+en+materia+de+contrato+del+trabajador+aut%C3%B3n...&label=Real+Decreto+n%C3%BAm.+197%2F2009%2C+de+23+febrero&docguid=I3407bf608eb111ea98abc16d771da8bc
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.db_id = param._;
    result.unitid = param.docguid;

  } else if (/^\/maf\/app\/document$/i.test(path)) {
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
  }

  return result;
});
