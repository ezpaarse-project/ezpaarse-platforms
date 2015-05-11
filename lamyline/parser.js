#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result   = {};
  var pathname = parsedUrl.pathname;

  if (pathname == '/Content/DocumentView.aspx') {
    // http://lamyline.lamy.fr/Content/DocumentView.aspx?params=H4sIAAAAAAAEAO29B2AcSZYlJi9tynt/SvVK1+B0oQiAYBMk2JBAEOzBiM3mkuwdaUcj
    // KasqgcplVmVdZhZAzO2dvPfee++999577733ujudTif33/8/XGZkAWz2zkrayZ4hgKrIHz9+fB8/In7ROq+v3+Tv2s/avGl/YXO9rJbXi8/e1Ov8F7bZpPnswS/Mpu
    // 06K59W08928Xtxmb/JJvR5W7VZ+SpvPtvbvffpL6zqWV4/uf5s5xc28+rqRXZZXGRtUS2fZLVAK2azz+7vPrh/797BL7zM64a+++wni4t82ea/cF5czJ/T/1tpmjVN
    // 0ZxUJXXS5Fk9nb/MLvLPvsgush8Uy7wZZ83q3S9cZG2b15+9fv38d38w/Q7/e/L01bfx4+SU/n3++ifo389PX52+op8vntE/T1+9PH5DP1995yX/eXL2k/jr6TH+ev
    // X8hP99esY/5BO0fvL0FB99+fInvjrGx0/w4dMv8M7z1y++g05enb44ff4cvT59+W3F7PfKrz97dfqTZ6/fHP/CcvmW6Peax8JD/H8AN3adcXcBAAA=WKE
    result.unitid= "Content/DocumentView";
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if (pathname == '/Content/PageViewPDF.aspx') {
    //  http://lamyline.lamy.fr/Content/PageViewPDF.aspx?params=H4sIAAAAAAAEAO29B2AcSZYlJi9tynt/SvVK1+B0oQiAYBMk2JBAEOzBiM3mkuwdaUcj
    //  KasqgcplVmVdZhZAzO2dvPfee++999577733ujudTif33/8/XGZkAWz2zkrayZ4hgKrIHz9+fB8/In7ROq+v3+Tv2s/avGl/YXO9rJbXi8/e1Ov8F7bZpPnswS/M
    //  pu06K59W08928Xtxmb/JJvR5W7VZ+SpvPtvbvffpL6zqWV4/uf5s5xc28+rqRXZZXGRtUS2fZLVAK2azz+7vPrh/797BL7zM64a+++wni4t82ea/cF5czJ/T/1tp
    //  mjVN0ZxUJXXS5Fk9nb/MLvLPvsgush8Uy7wZZ83q3S9cZG2b15+9fv38d38w/Q7/e/L01bfx4+SU/n3++ifo389PX52+op8vntE/T1+9PH5DP1995yX/eXL2k/jr
    //  6TH+evX8hP99esY/5BO0fvL0FB99+fInvjrGx0/w4dMv8M7z1y++g05enb44ff4cvT59+W3F7PfKrz97dfqTZ6/fHP/CcvmW6Peax8JD/H8AN3adcXcBAAA=WKE
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid= "Content/PageViewPDF";
  }
  return result;
});
