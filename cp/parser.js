#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Checkpoint
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

  if (/^\/maf\/app\/document$/i.test(path)) {
    // https://www.checkpoint.cl/maf/app/document?&src=laley&srguid=i0ad82d9b0000017d158f00cb8493ec9f&docguid=i9F03F92785BB0A6F3CD30FFC4ABE31F4&hitguid=i9F03F92785BB0A6F3CD30FFC4ABE31F4&spos=1&epos=1&td=1947&ao=i0ADFAB86AF526A5181AF60C0D0F2C8EE&searchFrom=widget&savedSearch=false
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';

  } else if (/^\/maf\/app\/widget\/multisearchfromlink\/run$/i.test(path)) {
    // https://www.checkpoint.cl/maf/app/widget/multisearchfromlink/run?ao=o.i0ADFAB86AF526A5181AF60C0D0F2C8EE&context=9&stid=st-widget-cl-general&ds=LLAR-CL-JAD-COEX%3BLLAR-CL-CONSCMX%3BLLAR-CL-LEG-COEX%3BLLAR-CL-JUR-COEX%3BLLAR-CL-FRMCMX%3BLLAR-CL-PFCMX%3BLLAR-CL-EJRCMX%3BLLAR-CL-VAR-BOFI%3BLLAR-CL-RLEG-LL%3BLLAR-CL-JADM-DDT%3BLLAR-CL-CONS-SS%3BLLAR-CL-CONS-ED%3BLLAR-CL-JADM-CSA%3BLLAR-CL-JUR-STCL%3BLLAR-CL-DOC-FLAB%3BLLAR-CL-JADM-CSU%3BLLAR-CL-DOC-MCL%3BLLAR-CL-FORM-LAB%3BLLAR-CL-LABEJR%3BLLAR-CL-DOC-PF%3BLLAR-CL-CONS-LAB%3BLLAR-CL-SUM-LAB%3BLLAR-CL-REV-CPL%3BLLAR-CL-JUR-STCT%3BLLAR-CL-SUM-TRIB%3BLLAR-CL-CONS-DJ%3BLLAR-CL-REV-MCT%3BLLAR-CL-FORM-TRI%3BLLAR-CL-CONS-TRI%3BLLAR-CL-LEG-CDT%3BLLAR-CL-RLEG-TRI%3BLLAR-CL-DOC-EJER%3BLLAR-CL-DOC-PFT%3BLLAR-CL-REV-AFII%3BLLAR-CL-JADM-SII%3BLLAR-CL-CONS-FRM%3BLLAR-CL-CKL-IFRS%3BLLAR-CL-DOC-IFRS%3BLLAR-CL-CONSIFRS%3BLLAR-CL-DOC-I-NINT%3BLLAR-CL-DOC-I-BOL%3BLLAR-CL-ENF-REV%3BLLAR-CL-CMPIFRS%3BLLAR-CL-RLEG-IFRS%3B&searchFrom=widget&originates-from-link=true&qry=MultiSearch&infotype=global&thesaurus=&thesaurusCount=&subject1=&subject2=&subject3=&thesaurusDs=LLAR-TESAURO-CL&frt=renta&ds-original=LLAR-CL-JAD-COEX%3BLLAR-CL-CONSCMX%3BLLAR-CL-LEG-COEX%3BLLAR-CL-JUR-COEX%3BLLAR-CL-FRMCMX%3BLLAR-CL-PFCMX%3BLLAR-CL-EJRCMX%3BLLAR-CL-VAR-BOFI%3BLLAR-CL-RLEG-LL%3BLLAR-CL-JADM-DDT%3BLLAR-CL-CONS-SS%3BLLAR-CL-CONS-ED%3BLLAR-CL-JADM-CSA%3BLLAR-CL-JUR-STCL%3BLLAR-CL-DOC-FLAB%3BLLAR-CL-JADM-CSU%3BLLAR-CL-DOC-MCL%3BLLAR-CL-FORM-LAB%3BLLAR-CL-LABEJR%3BLLAR-CL-DOC-PF%3BLLAR-CL-CONS-LAB%3BLLAR-CL-SUM-LAB%3BLLAR-CL-REV-CPL%3BLLAR-CL-JUR-STCT%3BLLAR-CL-SUM-TRIB%3BLLAR-CL-CONS-DJ%3BLLAR-CL-REV-MCT%3BLLAR-CL-FORM-TRI%3BLLAR-CL-CONS-TRI%3BLLAR-CL-LEG-CDT%3BLLAR-CL-RLEG-TRI%3BLLAR-CL-DOC-EJER%3BLLAR-CL-DOC-PFT%3BLLAR-CL-REV-AFII%3BLLAR-CL-JADM-SII%3BLLAR-CL-CONS-FRM%3BLLAR-CL-CKL-IFRS%3BLLAR-CL-DOC-IFRS%3BLLAR-CL-CONSIFRS%3BLLAR-CL-DOC-I-NINT%3BLLAR-CL-DOC-I-BOL%3BLLAR-CL-ENF-REV%3BLLAR-CL-CMPIFRS%3BLLAR-CL-RLEG-IFRS%3B
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
