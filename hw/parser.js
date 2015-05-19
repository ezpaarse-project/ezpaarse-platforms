#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 250*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl, ec) {

  var result   = {};
  var pathname = parsedUrl.pathname;
  var hostname = parsedUrl.hostname;
  var fileSize = ec ? parseInt(ec.size, 10) : undefined; // because size could be a string (comming from the test CSV)
  var match;

  result.title_id = hostname;
//console.log(parsedUrl);

  if ((match = /^\/content\/([0-9]+\/[0-9\-]+\/[0-9a-zA-Z\.]+\.(abstract|full|full\.pdf))(\+html)?$/.exec(pathname)) !== null) {
    /**
     * examples : http://rsbl.royalsocietypublishing.org/content/6/4/458.abstract
     *            http://rsbl.royalsocietypublishing.org/content/6/4/458.full
     *            http://rsbl.royalsocietypublishing.org/content/6/4/458.full.pdf
     *            http://cshprotocols.cshlp.org/content/2012/5/pdb.top069344.full.pdf
     *            http://dmm.biologists.org.gate1.inist.fr/content/1/2-3/69.1.full.pdf+html
     */
    result.unitid  = hostname + '/' + match[1];

    switch (match[2]) {
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'full.pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    }
  } else if ((match = /^\/content\/([a-z]+\/[0-9]+\/[0-9\-]+\/[0-9a-zA-Z\.]+\.(abstract|full|full\.pdf))(\+html)?$/.exec(pathname)) !== null) {
    /**
     *            http://advan.physiology.org.gate1.inist.fr/content/ajpadvan/38/3/229.full.pdf
     */
    result.unitid  = hostname + '/' + match[1];

    switch (match[2]) {
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'full.pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    }
 } else if ((match = /\/doi\/pdf(plus)?\/(([0-9\.]+)\/([^\/\(\.)]+))$/.exec(pathname)) !== null) {
    // http://www.nrcresearchpress.com.gate1.inist.fr/doi/pdfplus/10.1139/er-2013-0083?src=recsys
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    //result.title_id = match[4];
    result.unitid = hostname + '/' + match[2];
  } else if ((match = /^\/cgi\/reprint\/([a-zA-Z]+\;[0-9\/]+)$/.exec(pathname)) !== null) {
    // http://preventionportal.aacrjournals.org.gate1.inist.fr/cgi/reprint/canres;74/16/4378
    result.unitid = hostname + '/' + match[1].replace(";","/");
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
  } else if ((match = /^\/content\/([0-9]+\/[0-9]+\.toc)$/.exec(pathname)) !== null) {
    // example : http://www.jimmunol.org.gate1.inist.fr/content/188/3.toc
    result.unitid = hostname + '/' + match[1];
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
  } else if ((match =  /^\/content\/([a-z]+)\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([A-Z]+\.[0-9]{4}\.[0-9]+\.[0-9]+\.[0-9A-Z]+)\/([0-9a-zA-Z]+\_[A-Z]+\.[0-9]{4}\.[0-9]+\.[0-9]+\.pdf)$/.exec(pathname))!== null) {
    //http://jco.ascopubs.org.gate1.inist.fr/content/suppl/2015/03/23/JCO.2014.55.9898.DC1/Protocol1_JCO.2014.55.9898.pdf
    //http://jco.ascopubs.org.gate1.inist.fr/content/suppl/2015/03/09/JCO.2014.58.9747.DC2/Protocol_JCO.2014.58.9747.pdf
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.title_id = match[6];
    result.unitid = "content" +"/"+ match[1] +"/"+ match[2] +"/"+ match[3] +"/"+ match[4] +"/"+ match[5];
  }
  //([0-9a-zA-Z]+\_[A-Z]+\.[0-9]{4}\.[0-9]+\.[0-9]+\.[0-9A-Z]+\.pdf)
  // if the size is less than 10ko, it's not the actual article but a login page
  if (fileSize && fileSize < 10000) {
    result._granted = false;
  }

  // do not return ECs with empty rtype and empty mime
  if (!result.rtype && !result.mime) {
    result = {};
  }

  return result;
});
