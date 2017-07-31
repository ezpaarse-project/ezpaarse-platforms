#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Scientific American
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  let match;

  // https://www.scientificamerican.com

  if (((match = /^\/([a-z]+)\/([a-z]+)*(\/)*$/.exec(path)) !== null)) {
    // /arabic/search/?q=%D8%A7%D9%84%D8%A5%D9%86%D8%A7%D8%AB%D8%8C+%D9%88%D8%A3%D9%86+
    // /search/?q=car
    // /espanol/search/?q=fiestas&source=article&sortby=score

    if (match[1] === 'search' || match[2] === 'search') {
      result.rtype = 'SEARCH';
      result.mime  = 'HTML';
    }
  } else if (/^\/([a-z]+\/)*([a-z]+)\/podcast.mp3$/.test(path)) {
    // /podcast/podcast.mp3?fileId=94932CD5-371C-44CD-959CDF37F57EAE4E
    // /arabic/podcast/podcast.mp3?fileId=64815548-18E1-4181-8649CAF40FE57D5A

    if (param.fileId) {
      result.rtype  = 'AUDIO';
      result.mime   = 'MISC';
      result.unitid = param.fileId;
    }
  } else if (((match = /^\/(arabic|espanol)*(\/)*([a-z-]+)\/([a-z0-9-]+)\/$/.exec(path)) !== null)) {
    // /arabic/articles/bring-science-home/
    // /article/revenge-of-the-super-lice/
    // /espanol/noticias/hallan-por-primera-vez-una-proteina-similar-a-un-prion-en-una-bacteria/

    // /espanol/imagenes-de-la-ciencia/fosil-de-mosquito-dominicano-ofrece-pistas-sobre-el-origen-de-la-malaria/
    // /espanol/ultimos-videos/mercurio-al-desnudo-video/
    // /video/400-fish-released-into-the-revitalized-bronx-river/
    // /arabic/videos/how-do-genes-influence-behavior/

    switch (match[3]) {
    case 'video':
    case 'videos':
    case 'ultimos-videos':
      result.rtype    = 'VIDEO';
      result.mime     = 'MISC';
      result.title_id = match[4];
      break;
    case 'article':
    case 'articles':
    case 'noticias':
    case 'imagenes-de-la-ciencia':
    case 'slideshows':
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.title_id = match[4];
      break;
    default:
      // /life-unbounded/jupiter-now-has-69-moons/
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.title_id = match[4];
    }

  } else if (((match = /^\/espanol\/noticias\/[a-z-]+\/([a-z0-9-]+)\/$/.exec(path)) !== null)) {
    // /espanol/noticias/reuters/la-oms-emitio-la-lista-de-las-bacterias-mas-peligrosas-del-mundo/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];

  } else  if (((match = /^\/(arabic\/)?(podcasts?|articles?)\/[a-z0-9-]+\/([a-z0-9-]+)\/$/.exec(path)) !== null)) {
    // /arabic/podcasts/60-second-science/small-brained-birds-more-likely-to-get-shot/
    // /podcast/episode/opioids-still-needed-by-some-pain-patients/
    // /arabic/articles/news/birth-control-pills-pros-and-cons/
    // /arabic/articles/from-the-magazine/contacting-stranded-minds1/

    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[3];
  }



  return result;
});
