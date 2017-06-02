#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Geofacets
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

  if ((match = /^\/article\/(([SB])?([0-9]{7}[0-9]{5}?[0-9Xx])[0-9A-Za-z]*)\/content\/(.+)$/i.exec(path)) !== null) {
//https://www.geofacets.com/article/S0883292707003496/content/S0883292707003496_2?_=1490189035640
//https://www.geofacets.com/article/S0883292707003496/content/S0883292707003496_fig_6?_=1490189087016 
//https://www.geofacets.com/article/S0883292707003496/content/S0883292707003496_tbl_1?_=1490189838073    

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid   = match[4];	
    let cgi_param = match[4];
    if (cgi_param.indexOf("_tbl_") != -1){
        result.rtype    = 'TABLE';
        result.mime     = 'HTML';
        } else {
	 result.rtype    = 'MAP';
        result.mime     = 'HTML';
	}
  } else if ((match = /^\/swf.jsp$/i.exec(path)) !== null) {
//https://www.geofacets.com/swf.jsp?pii=S0883292707003496&id=44609eeb-593e-41a6-91b8-e746551dacc6.1044e99a166663bba18c1b0c1edd3c7841a2204bc6e772136cb41f9b5154ecd9bd604f453e4001bc9dc8b3e74db508222a47e1d9049d0c89d37710f1f1658162.1490188998536.1200000
//https://www.geofacets.com/swf.jsp?pii=101002esp1329&id=5b99d343-e1db-4c74-a9d6-434e9412a356.907b5f1b924da56c4a415c658be839cbfd1a3251d7e4cc6bf771244fbb2bdb85a8bdafedcba70aabf91d1152776236a7d5b2c91d04a78c6f6cd1cdc5191728be.1490189747478.1200000 	
    result.rtype    = 'ABS';
    result.mime     = 'PDF';
    result.unitid   = param.pii;
  } else if ((match = /^\/figuredownload$/i.exec(path)) !== null) {
//https://www.geofacets.com/figuredownload?aMapid=S0883-2927(07)00349-6_2&mapid=S0883-2927(07)00349-6_fig_7&id=89b821cb-1eef-4181-9f6a-1c079677707c.bb97dd82d852671bc41368beb8b411d76e07ae6c88b80772e720ca74b0dd1b65376ea5000a3b789326889884ff623889bbfb78f8bdacd8ee18c8394d370ac1fa.1490189508706.1200000&format=TIF&fauthor=CovelliStefano&atitle=Benthic%20fluxes%20of%20mercury%20species%20in%20a%20lagoon%20environment%20(Grado%20Lagoon%2C%20Northern%20Adriatic%20Sea%2C%20Italy) 

    result.rtype    = 'ABS';
    result.mime     = 'ZIP';
    result.unitid   = param.mapid;
    result.title_id = param.atitle;
  } else if ((match = /^\/xmldownload$/i.exec(path)) !== null) {
//https://www.geofacets.com/xmldownload?aMapid=10.2110%2Fpec.11.98.0051_1&mapid=10.2110/pec.11.98.0051_1&id=22e2b843-6218-45b5-8287-59e2eb677c5f.c00915375c51787cc84e212eb431aaf42951b1656545381de7d49b8757f756b993635b49890000730d174027355a16f3375b4a901d1b10439ef8b85860429f18.1490191008522.1200000&format=TIF&fauthor=FrybergerSteven%20G.&atitle=Rotliegend%20facies%2C%20sedimentary%20provinces%2C%20and%20stratigraphy%2C%20southern%20Permian%20basin%20UK%20and%20the%20Netherlands%3A%20A%20review%20with%20new%20observations

    result.rtype    = 'ABS';
    result.mime     = 'ZIP';
    result.unitid   = param.mapid;
    result.title_id = param.atitle;
  } else if ((match = /^\/download$/i.exec(path)) !== null) {
//https://www.geofacets.com/download?mapid=S0883-2927(07)00349-6_fig_7&id=89b821cb-1eef-4181-9f6a-1c079677707c.bb97dd82d852671bc41368beb8b411d76e07ae6c88b80772e720ca74b0dd1b65376ea5000a3b789326889884ff623889bbfb78f8bdacd8ee18c8394d370ac1fa.1490189508706.1200000&format=TIF&fauthor=CovelliStefano&atitle=Benthic%20fluxes%20of%20mercury%20species%20in%20a%20lagoon%20environment%20(Grado%20Lagoon%2C%20Northern%20Adriatic%20Sea%2C%20Italy)
//https://www.geofacets.com/download?mapid=S0883-2927(07)00349-6_fig_7&id=89b821cb-1eef-4181-9f6a-1c079677707c.bb97dd82d852671bc41368beb8b411d76e07ae6c88b80772e720ca74b0dd1b65376ea5000a3b789326889884ff623889bbfb78f8bdacd8ee18c8394d370ac1fa.1490189508706.1200000&format=FULL&fauthor=CovelliStefano&atitle=Benthic%20fluxes%20of%20mercury%20species%20in%20a%20lagoon%20environment%20(Grado%20Lagoon%2C%20Northern%20Adriatic%20Sea%2C%20Italy)
//https://www.geofacets.com/download?mapid=S0883-2927(07)00349-6_fig_7&id=89b821cb-1eef-4181-9f6a-1c079677707c.bb97dd82d852671bc41368beb8b411d76e07ae6c88b80772e720ca74b0dd1b65376ea5000a3b789326889884ff623889bbfb78f8bdacd8ee18c8394d370ac1fa.1490189508706.1200000&format=KML&fauthor=CovelliStefano&atitle=Benthic%20fluxes%20of%20mercury%20species%20in%20a%20lagoon%20environment%20(Grado%20Lagoon%2C%20Northern%20Adriatic%20Sea%2C%20Italy)
    let format = param.format;
    if (format.indexOf("TIF") != -1){
	result.rtype    = 'IMAGE';
	result.mime     = 'TIFF';
	result.title_id = param.atitle;
	result.unitid   = param.mapid;
	}
    if (format.indexOf("FULL") != -1){
        result.rtype    = 'IMAGE';
        result.mime     = 'JPEG';
        result.title_id = param.atitle;
        result.unitid   = param.mapid;
        }
     if (format.indexOf("KML") != -1){
        result.rtype    = 'MAP';
        result.mime     = 'MISC';
        result.title_id = param.atitle;
        result.unitid   = param.mapid;
        }		
  }

  return result;
});
