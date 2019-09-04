#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const searchPatterns = [
  /^\/[a-z0-9_-]+\/[a-z0-9_-]+\/SearchByRegion.asp$/i,
  /^\/[a-z0-9_-]+\/browse$/i,
  /^\/[a-z0-9_-]+\/browse\/[a-z0-9_-]+$/i,
  /^\/[a-z0-9_-]+\/google\/result.asp$/i,
  /^\/[a-z0-9_-]+\/playlists\/playlist.asp$/i,
  /^\/[a-z0-9_-]+\/search$/i,
  /^\/[a-z0-9_-]+titles.asp$/i,
  /^\/category\/[a-z0-9_-]+\/[a-z0-9_-]+\/[a-z0-9_-]+$/i,
  /^\/newreleases\/[a-z0-9_-]+\/[a-z0-9_-]+$/i,
  /^\/resources\/opera\/[a-z0-9_-]+$/i,
  /^\/resources\/opera\/[a-z0-9_-]+\/[a-z0-9_-]+ param.f = null$/i,
  /^\/resources\/pronunciation\/[a-z0-9_-]+$/i,
  /^\/google\/result.asp$/i,
  /^\/work\/[a-z0-9_-]+\/$/i,
  /^\/(search|label|persons?|composers?|artist|recentaddi?tions|newreleases|filtered)\/[a-z0-9_-]+\/?$/i,
  /^\/(search|label|persons?|composers?|artist|recentaddi?tions|news|resources|catcategory)\/?$/i,
  /^\/(Readerlist|recentaddi?tions|labels|authorList|newreleases|browsesearch(label)?)\.asp$/i
];

/**
 * Recognizes the accesses to the platform Naxos
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  let match;

  if (searchPatterns.some(p => p.test(path))) {
    // Many
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/(world|jazz)\/([a-z0-9_-]+).asp$/i.exec(path)) !== null) {
    if (match[2] === 'artist_pro_new') {
      // https://emory.naxosmusiclibrary.com:443/World/artist_pro_new.asp?personid=32318
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = param.personid;
    } else if (match[2] === 'culturalgroupinfo') {
      // https://emory.naxosmusiclibrary.com:443/World/culturalgroupinfo.asp?id=ANA
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = param.id;
    } else if (match[2] === 'featuredarticles') {
      // https://emory.naxosmusiclibrary.com:443/world/featuredarticles.asp?art=Mali
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
      result.unitid = param.art;
    } else if (match[2] !== null) {
      // https://emory.naxosmusiclibrary.com:443/jazz/artistlist.asp
      result.rtype = 'SEARCH';
      result.mime  = 'HTML';
    }

  } else if ((match = /^\/resources\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    if (match[1] === 'playlist') {
      // https://emory.nml3.naxosmusiclibrary.com:443/resources/playlist?tab=omea
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = match[1];
    } else if (match[1] === 'work-analyses') {
      //  https://emory.nml3.naxosmusiclibrary.com:443/resources/work-analyses
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = match[1];
    } else if (match[1] !== null) {
      //  https://emory.nml3.naxosmusiclibrary.com:443/resources/audiobooks
      result.rtype  = 'SEARCH';
      result.mime   = 'HTML';
      result.unitid = match[1];
    }

  } else if ((/^\/catalogue\/item\.asp$/i.test(path)) || (/^\/folder$/i.test(path)) || (/^\/naxos\/track\/trackListByIds$/i.test(path))) {
    // https://emory.naxosspokenwordlibrary.com:443/catalogue/item.asp?cid=NA443812
    // https://emory.nml3.naxosmusiclibrary.com:443/folder?category=nml&_pjax=%23main
    //https://emory.nml3.naxosmusiclibrary.com:443/naxos/track/trackListByIds?ids=4168074%2C4168075%2C4168076%2C4168077%2C4168078%2C4168079%2C4168080%2C4168081%2C4168082%2C4168083%2C4168084%2C4168085%2C4168086%2C4168087%2C4168088%2C4168089%2C4168090%2C4168091%2C4168092%2C4168093%2C4168094%2C4168095%2C4168096%2C4168097%2C4168098&quality=
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = param.cid || param.category || param.ids;

  } else if (/^\/([a-z0-9_-]+)\/catalogue\/item\.asp$/i.test(path)) {
    // https://emory.naxosmusiclibrary.com:443/jazz/catalogue/item.asp?cid=CD-4835
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = param.cid;

  } else if (/^(\/[a-z0-9_-]+)?\/composer\/btm\.asp$/i.test(path) || /^\/artist_pro_new\.asp$/i.test(path)) {
    // https://emory.naxosspokenwordlibrary.com:443/composer/btm.asp?composerid=333317
    // https://emory.naxosmusiclibrary.com:443/World/composer/btm.asp?composerid=252742
    // https://emory.naxosspokenwordlibrary.com:443/artist_pro_new.asp?personid=238263
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = param.composerid || param.personid;

  } else if ((match = /^\/([a-z0-9_-]+)\/GeoMap\/GeoMapApi\.asp$/i.exec(path)) !== null) {
    // https://emory.naxosmusiclibrary.com:443/World/GeoMap/GeoMapApi.asp?cmd=GetCountryListByRegion&region=053
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = param.region;

  } else if ((match = /^\/label\/([a-z0-9_-]+\/[a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/label/BLI/-1/1?_pjax=%23main
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/guidedtours\/([a-z0-9_-]+)\/$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/guidedtours/20thcentury/
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/studyarea\/([a-z0-9_-]+)\/$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/studyarea/ireland/
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/studyarea\/([a-z0-9_-]+\/[a-z0-9_-]+)\/$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/studyarea/aus/gentop/
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/work-analyses\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/work-analyses/20_nielsen_carl?_pjax=%23main
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/work\/[a-z0-9_-]+\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/work/catalogue/117491
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/catalogue\/([a-z0-9_-]+)/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/catalogue/7502258852989?_pjax=%23main
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/arthur\/(data\/[a-z0-9_-]+).htm$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/arthur/data/booklet.htm
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/mtio\/assets\/pages\/([a-z0-9_-]+)\.asp$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/mtio/assets/pages/transp.asp
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/mtio\/assets\/pages\/([a-z0-9_-]+\/[a-z0-9_-]+)\.asp$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/mtio/assets/pages/bclar/sndbclar.asp
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/guidedtours\/([a-z0-9_-]+)\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/guidedtours/nationalism/06_verdi_giuseppe?_pjax=%23main
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[2];

  } else if ((match = /^\/resources\/opera\/([a-z0-9_-]+)\/([a-z0-9_%-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/opera/synopses/elegy%20for%20young%20lovers?f=e&_pjax=%23main
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[2];

  } else if ((match = /^\/resources\/opera\/[a-z0-9_-]+\/([a-z0-9_-]+\/[a-z0-9_-]+\/[a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/opera/libretto/haydn/the_creation/english/part_2
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if (((match = /^\/works\/([a-z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/work\/([a-z0-9_-]+)$/i.exec(path)) !== null)) {
    // https://emory.nml3.naxosmusiclibrary.com:443/work/117491?type=analysis&_pjax=%23main
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/sharedfiles\/booklets\/[a-z0-9_-]+\/([a-z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // https://emory.naxosmusiclibrary.com:443/sharedfiles/booklets/CHA/booklet-CHAN20141.pdf
    result.rtype  = 'REF';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/arthur\/data\/([a-z0-9_-]+)\.mp3$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/arthur/data/canada.mp3
    result.rtype  = 'AUDIO';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/media\/aacstorage\/[a-z0-9_-]+\/[a-z0-9_-]+\/([a-z0-9_-]+)\.mp4$/i.exec(path)) !== null) {
    // https://audiostream.naxosmusiclibrary.com:443/media/aacstorage/aac128k/nac/383871_01_full_128.mp4?dlauth=1565893683_ab51a603d9caa624e21b755d97b81290
    result.rtype  = 'AUDIO';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if (/^\/mediaplayer\/player\.asp$/i.test(path)) {
    // https://emory.naxosspokenwordlibrary.com:443/mediaplayer/player.asp?br=64&domain=emory.naxosspokenwordlibrary.com&pl_token=CB07DBA7-A441-4D50-80D8-2EA3C796E21A&forceFlash=0&tracktoplay=&tp=
    result.rtype  = 'AUDIO';
    result.mime   = 'MISC';
    result.unitid = param.tl;

  } else if ((match = /^\/resources\/pronunciation\/([a-z0-9_-]+\/[a-z0-9_%-]+)\.mp3$/i.exec(path)) !== null) {
    // http://www.naxosmusiclibrary.com:80/resources/pronunciation/american/americapron_002.mp3
    result.rtype  = 'AUDIO';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/title\/([a-z0-9_.-]+)/i.exec(path)) !== null) {
    // http://emory.naxosvideolibrary.com:80/title/2.110291/
    result.rtype  = 'VIDEO';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if (((match = /^\/resources\/juniorsection\/([a-z0-9_-]+)\/?$/i.exec(path)) !== null)) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/juniorsection/historyofopera
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/juniorsection/historyofclassicalmusic/
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/juniorsection\/([a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/juniorsection/historyofclassicalmusic/part2
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/studyarea\/([a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/studyarea/ireland/chapter02?_pjax=%23main
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if (/^\/resources\/studyarea\/([a-z0-9_-]+)\/([a-z0-9_-]+)\.([a-z]+)$/i.test(path) || /^\/default\.asp$/i.test(path)) {
    // https://emory.naxosmusiclibrary.com:443/resources/studyarea/ireland/default.asp?content=Chapter02
    // https://emory.naxosmusiclibrary.com:443/default.asp?page_name=resources&label=studyarea1&path=09_Music_of_the_Twentieth_Century.htm
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.unitid = param.content || param.path;

  } else if ((match = /^\/resources\/studyarea\/([a-z0-9_-]+\/[a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/studyarea/aus/gentop/09_music_of_the_twentieth_century?_pjax=%23main
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.unitid = match[1];

  }

  return result;
});
