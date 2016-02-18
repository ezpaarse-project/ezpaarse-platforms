#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';

var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;
  var url    = parsedUrl.href;

  var match;
  if ((match = /^\/([a-zA-Z0-9]+)\/journal\/v([0-9a-z]*)\/n(([0-9]*|current))\/(pdf|full|abs|extref)\/([a-zA-Z0-9\.\-]*)\.(pdf|html)$/.exec(path)) !== null) {
    //console.error(match);
    result.title_id    = match[1];
    result.unitid =  result.doi =  '10.1038/' + match[6];

    //result.volume = match[2];
    //result.issue = match[3];
    //result.revue  = match[5];


    if (match[5].toUpperCase() == 'FULL') {
      // example : http://www.nature.com.gate1.inist.fr/nature/journal/v493/n7431/full/493166a.html
      // http://www.nature.com.gate1.inist.fr/nrm/journal/vaop/ncurrent/full/nrm3940.html
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';

    } else if (match[5].toUpperCase() == 'PDF') {
      // example : http://www.nature.com.gate1.inist.fr/nature/journal/v493/n7431/pdf/493166a.pdf
      // http://www.nature.com.gate1.inist.fr/cdd/journal/vaop/ncurrent/pdf/cdd2014195a.pdf
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';



    } else if (match[5] == 'extref') {
      // example : http://www.nature.com.gate1.inist.fr/nature/journal/v445/n7125/extref/nature05382-s1.pdf
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      result.doi = '10.1038/' + match[6].split('-')[0];
    } else {
      result.rtype = 'ABS';
      result.mime  = 'HTML';

    }
    if (match[1] != 'nature' && match[6].charAt(match[6].length- 1) ==='a')
    {

      var replace = match[6].replace(match[1], '').replace('a', '');
      result.doi = '10.1038/' + match[1] + '.' + replace.substr(0, 4) + '.' +replace.substr(4, 4) ;
      result.publication_date= replace.substr(0, 4);


    }

  } else if ((match = /\/([a-zA-Z0-9]+)\/(knowledgeenvironment\/)?(([0-9]*)\/([0-9]*)\/[a-zA-Z0-9]+)\/(pdf|full)\/([a-zA-Z0-9]*).(pdf|html)/.exec(url)) !== null) {
    //console.error(match);
    result.title_id = match[1];
    //result.volume = match[2];
    //result.issue = match[3];
    //result.year  = match[4];
    result.publication_date= match[4];
    result.unitid = result.doi = '10.1038/' + match[7];
    if (match[1]==='bonekey') {
      result.doi = '10.1038/' + match[7].substr(0, 7) + '.' + match[7].substr(7, 8).substr(0, 4) + '.' +match[7].substr(11, 11).substr(0, 3) ;
    }
    if (match[6].toUpperCase() == 'FULL') {
      // example : http://www.nature.com.gate1.inist.fr/bonekey/knowledgeenvironment/2012/120613/bonekey2012109/full/bonekey2012109.html
      // http://www.nature.com.gate1.inist.fr/ncomms/2013/130628/ncomms3097/full/ncomms3097.html

      result.rtype = 'ARTICLE';
      result.mime = 'HTML';

    } else {
      // example : http://www.nature.com.gate1.inist.fr/bonekey/knowledgeenvironment/2012/120613/bonekey2012109/pdf/bonekey2012109.html
      // http://www.nature.com.gate1.inist.fr/ncomms/2013/130829/ncomms3380/pdf/ncomms3380.pdf
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';

    }
  } else if ((match = /\/([a-zA-Z0-9]+)\/journal\/v([0-9]*)\/n([a-zA-Z0-9]*)\/index.html/.exec(url)) !== null) {
    // example http://www.nature.com.gate1.inist.fr/nature/journal/v493/n7431/index.html
    result.title_id = match[1];
    //result.volume = match[2];
    //result.numero = match[3];
    result.unitid = match[1] + '/v' + match[2] + '/n' + match[3];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/([a-zA-Z0-9]+)\/index.html/.exec(path)) !== null) {
    // example : http://www.nature.com.gate1.inist.fr/nature/index.html
    result.unitid = match[1];
    result.title_id = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/([a-zA-Z0-9]+)\/archive\/index.html/.exec(path)) !== null) {
    // example : http://www.nature.com/clpt/archive/index.html?showyears=2013-2011-#y2011
    result.unitid = match[1];
    result.title_id = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/([a-zA-Z0-9]+)\/current_issue.html/.exec(url)) !== null) {
    // example : http://www.nature.com.gate1.inist.fr/nature/current_issue.html
    result.unitid = match[1];
    result.title_id = match[1];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/news\/([^\/]+)/.exec(url)) !== null) {
    // example : http://www.nature.com/news/work-resumes-on-lethal-flu-strains-1.12266
    result.unitid = match[1];
    result.title_id = 'nature';
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if ((match = /\/polopoly_fs\/.+\/([a-zA-Z0-9]+)\.pdf/.exec(url)) !== null) {
    // example : http://www.nature.com/polopoly_fs/1.12266
    result.unitid = match[1];
    result.title_id = 'nature';
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  } else if ((match = /\/siteindex\/index.html/.exec(url)) !== null) {
    // example : http://www.nature.com.gate1.inist.fr/siteindex/index.html
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/ng\/([a-z]+)\/([a-z1-9]+)\/([a-z1-9]+)\/([a-z]+)\/(([a-z]{2}).([1-9]+)).(pdf|html)/.exec(url)) !== null) {
    //http://www.nature.com.gate1.inist.fr/ng/journal/v47/n8/pdf/ng.3342.pdf
    result.unitid = result.doi = '10.1038/' + match[5];
    result.title_id = '10.1038/' + match[5];
    result.rtype = 'ARTICLE';
    result.mime = match[8].toUpperCase();


    result.publication_date= match[4];
  }

  return result;
});
