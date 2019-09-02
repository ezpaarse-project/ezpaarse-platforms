#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform artnet
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

  if (/^\/search\/(artists|articles|)/i.test(path)) {
  // http://www.artnet.com:80/search/artists/?q=barton
  // http://www.artnet.com:80/search/?q=rainbow
  // http://www.artnet.com:80/search/articles/?q=luis-de-jesus
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if (/^\/artists\/artists-starting-with-(.*)$/i.test(path)) {
  // http://www.artnet.com:80/artists/artists-starting-with-b
  // http://www.artnet.com:80/artists/artists-starting-with-b%c3%adr%e2%80%93bis
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if ((match = /^\/(api|pdb|PDB)\/(search|galleries|faadsearch|FAADSearch)\/([0-z]+)/i.exec(path)) !== null) {
  // http://www.artnet.com:80/api/search/rainbow/artworks
  // http://www.artnet.com:80/api/galleries/rainbow/1/0
  // http://www.artnet.com:80/pdb/faadsearch/FAADResults3.aspx?Page=1&ArtType=FineArt
  // http://www.artnet.com:80/PDB/FAADSearch/FAADResults3.aspx?Page=1&ArtType=DecArt
    if (match[3] !== 'LotDetailView') {
      result.rtype = 'SEARCH';
      result.mime = 'HTML';
    }
  } if ((match = /^\/galleries\/([a-z-]+)/i.exec(path)) !== null) {
  // http://www.artnet.com:80/galleries/luis-de-jesus
  // http://www.artnet.com:80/galleries/avant-gallery/
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  } if ((match = /^\/(artists|auctions)\/([0-9a-z-/]+)$/i.exec(path)) !== null) {
    if (!match[2].startsWith('artists-starting-with-')) {
      // http://www.artnet.com:80/artists/alexander-barton/
      // http://www.artnet.com:80/artists/perrine-lievens/
      // https://www.artnet.com:443/auctions/photographs-0719
      // https://www.artnet.com:443/auctions/post-war-and-contemporary-art
      result.rtype = 'TOC';
      result.mime = 'HTML';
      result.unitid = match[1] + '/' + match[2];
      result.title_id = match[1] + '/' + match[2];
    }
  } if ((match = /^\/(galleries)\/([0-9a-z-]+)\/(([0-9a-z-]+)|([0-9a-z/]+))$/i.exec(path)) !== null) {
    // http://www.artnet.com:80/galleries/aca-galleries/the-end-of-western-art
    // ttp://www.artnet.com:80/galleries/avant-gallery/there-goes-the-neighborhood-new-art-for-the-new-new-york
    // http://www.artnet.com:80/galleries/roberts-projects/control/
    // http://www.artnet.com:80/galleries/galerie-von-bartha/artists/
    // http://www.artnet.com:80/galleries/avant-gallery/artworks/
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1] + '/' + match[2] + '/' + match[3];
    result.title_id = match[1] + '/' + match[2] + '/' + match[3];

  } if ((match = /^\/((auctions\/artists)|(auction-houses))\/([a-z-]+)\/([0-9a-z/-]+)$/i.exec(path)) !== null) {
    // https://www.artnet.com:443/auctions/artists/richard-hambleton/untitled-jumping-cat-4
    // https://www.artnet.com:443/auctions/artists/anish-kapoor/untitled-8
    // http://www.artnet.com:80/auction-houses/ewbanks/artist-banksy/
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1] + '/' + match[4] + '/' + match[5];
    result.title_id = match[1] + '/' + match[4] + '/' + match[5];

  } if ((match = /^\/(PDB\/FAADSearch\/LotDetailView)/i.exec(path)) !== null) {
  // http://www.artnet.com:80/PDB/FAADSearch/LotDetailView.aspx?Page=1&artType=FineArt&subTypeId=11
  // http://www.artnet.com:80/PDB/FAADSearch/LotDetailView.aspx?Page=1&artType=DecArt&subTypeId=159
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1] + '/' + param.artType + '-' + param.subTypeId;
    result.title_id = match[1] + '/' + param.artType + '-' + param.subTypeId;

  } if ((match = /^\/(pdb\/faadsearch\/lotpdfviewer)\.ashx/i.exec(path)) !== null) {
    // http://www.artnet.com:80/pdb/faadsearch/lotpdfviewer.ashx?Page=1&artType=FineArt&subTypeId=11
    // http://www.artnet.com:80/pdb/faadsearch/lotpdfviewer.ashx?Page=1&artType=DecArt&subTypeId=159
    result.rtype = 'REF';
    result.mime = 'PDF';
    result.unitid= match[1] + '/' + param.artType + '-' + param.subTypeId;
    result.title_id= match[1] + '/' + param.artType + '-' + param.subTypeId;

  } if ((match = /^\/(partner-content|art-world|opinion|market)\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://news.artnet.com:443/partner-content/booths-armory-show-2019
    // https://news.artnet.com:443/partner-content/art-guide-kent-connecticut
    // https://news.artnet.com:443/art-world/lisa-spellman-1604485
    // https://news.artnet.com:443/opinion/mural-controversy-devon-cook-mark-sanchez-reply-1599019
    // https://news.artnet.com:443/art-world/san-francisco-mural-victor-arnautoff-dewey-crumpler-1596409
    // https://news.artnet.com:443/market/christies-space-sale-flops-1604191
    // https://news.artnet.com:443/art-world/brancusi-lawsuit-1604065
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1] + '/' + match[2];
    result.title_id = match[1] + '/' + match[2];

  } if ((match = /^\/artists\/([a-z-]+)\/([0-z-]+)$/i.exec(path)) !== null) {
    // http://www.artnet.com:80/artists/landon-metz/untitled-a-F-4-l8cx00TtsWGlxClVWg2
    // http://www.artnet.com:80/artists/guy-le-baube/wool-a-1GdD4YzM8KIbY5srOuiETA2
    // http://www.artnet.com:80/artists/billy-apple/four-blue-knots-for-r-d-laing-a-rq3XAg8ygsCFqp9r2j9kZA2
    result.rtype = 'IMAGE';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.title_id = match[1] + '/' + match[2];

  }
  return result;
});