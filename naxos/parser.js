#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

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
  let param = parsedUrl.query || {};

  let match;

  if (((match = /^\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/SearchByRegion.asp$/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9_-]+)\/browse$/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9_-]+)\/browse\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9_-]+)\/google\/result.asp$/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9_-]+)\/playlists\/playlist.asp$/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9_-]+)\/search$/i.exec(path)) !== null) || ((match = /^\/search\/([a-zA-Z0-9_-]+)/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9_-]+)titles.asp$/i.exec(path)) !== null) || ((match = /^\/artist\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/category\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/composer\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/composers\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/filtered\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) || ((match = /^\/label\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) || ((match = /^\/newreleases\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/newreleases\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/person\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) || ((match = /^\/persons\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) || ((match = /^\/recentaddtions\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/resources\/opera\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/resources\/opera\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+) param.f = null$/i.exec(path)) !== null) || ((match = /^\/resources\/pronunciation\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/work\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) || (/^\/artist$/i.test(path)) || (/^\/authorList.asp$/i.test(path)) || (/^\/browsesearch.asp$/i.test(path)) || (/^\/browsesearchlabel.asp$/i.test(path)) || (/^\/catcategory$/i.test(path)) || (/^\/composer$/i.test(path)) || (/^\/composers\/$/i.test(path)) || (/^\/google\/result.asp$/i.test(path)) || (/^\/label$/i.test(path)) || (/^\/labels.asp$/i.test(path)) || (/^\/newreleases.asp$/i.test(path)) || (/^\/news$/i.test(path)) || (/^\/persons\/$/i.test(path)) || (/^\/Readerlist.asp$/i.test(path)) || (/^\/recentadditions.asp$/i.test(path)) || (/^\/recentaddtions$/i.test(path)) || (/^\/resources$/i.test(path)) || (/^\/search$/i.test(path)) || (/^\/search\/$/i.test(path))) {
    // Many
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/(world|World|jazz|Jazz)\/([a-zA-Z0-9_-]+).asp$/i.exec(path)) !== null) {
    if (match[2] == 'artist_pro_new') {
      // https://emory.naxosmusiclibrary.com:443/World/artist_pro_new.asp?personid=32318
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = param.personid;
    } else if (match[2] == 'culturalgroupinfo') {
      // https://emory.naxosmusiclibrary.com:443/World/culturalgroupinfo.asp?id=ANA    
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = param.id;
    } else if (match[2] == 'featuredarticles') {
      // https://emory.naxosmusiclibrary.com:443/world/featuredarticles.asp?art=Mali
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
      result.unitid = param.art;
    } else if (match[2] !== null) {
      // https://emory.naxosmusiclibrary.com:443/jazz/artistlist.asp  
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    }

  } else if ((match = /^\/resources\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    if (match[1] == 'playlist') {
      // https://emory.nml3.naxosmusiclibrary.com:443/resources/playlist?tab=omea
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = match[1];
    } else if (match[1] == 'work-analyses') {
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

  } else if ((/^\/catalogue\/item.asp$/i.test(path)) || (/^\/folder$/i.test(path)) || (/^\/naxos\/track\/trackListByIds$/i.test(path))) {
    // https://emory.naxosspokenwordlibrary.com:443/catalogue/item.asp?cid=NA443812
    // https://emory.nml3.naxosmusiclibrary.com:443/folder?category=nml&_pjax=%23main
    //https://emory.nml3.naxosmusiclibrary.com:443/naxos/track/trackListByIds?ids=4168074%2C4168075%2C4168076%2C4168077%2C4168078%2C4168079%2C4168080%2C4168081%2C4168082%2C4168083%2C4168084%2C4168085%2C4168086%2C4168087%2C4168088%2C4168089%2C4168090%2C4168091%2C4168092%2C4168093%2C4168094%2C4168095%2C4168096%2C4168097%2C4168098&quality=
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.cid || param.category || param.ids;

  } else if ((match = /^\/([a-zA-Z0-9_-]+)\/catalogue\/item.asp$/i.exec(path)) !== null) {
    // https://emory.naxosmusiclibrary.com:443/jazz/catalogue/item.asp?cid=CD-4835
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.cid;

  } else if (((match = /^\/([a-zA-Z0-9_-]+)\/composer\/btm.asp$/i.exec(path)) !== null) || ((match = /^\/composer\/btm.asp$/i.exec(path)) !== null) || ((match = /^\/artist_pro_new.asp$/i.exec(path)) !== null)) {
    // https://emory.naxosspokenwordlibrary.com:443/composer/btm.asp?composerid=333317
    // https://emory.naxosmusiclibrary.com:443/World/composer/btm.asp?composerid=252742
    // https://emory.naxosspokenwordlibrary.com:443/artist_pro_new.asp?personid=238263
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.composerid || param.personid;

  } else if ((match = /^\/([a-zA-Z0-9_-]+)\/GeoMap\/GeoMapApi.asp$/i.exec(path)) !== null) {
    // https://emory.naxosmusiclibrary.com:443/World/GeoMap/GeoMapApi.asp?cmd=GetCountryListByRegion&region=053
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.region;

  } else if ((match = /^\/label\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/label/BLI/-1/1?_pjax=%23main
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];

  } else if ((match = /^\/resources\/guidedtours\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/guidedtours/20thcentury/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/resources\/studyarea\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/studyarea/ireland/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/resources\/studyarea\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/studyarea/aus/gentop/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/resources\/work-analyses\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/work-analyses/20_nielsen_carl?_pjax=%23main
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/work\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/work/catalogue/117491
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  } else if ((match = /^\/catalogue\/([a-zA-Z0-9_-]+)/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/catalogue/7502258852989?_pjax=%23main
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/arthur\/data\/([a-zA-Z0-9_-]+).htm$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/arthur/data/booklet.htm
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = 'data/' + match[1];

  } else if ((match = /^\/mtio\/assets\/pages\/([a-zA-Z0-9_-]+).asp$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/mtio/assets/pages/transp.asp
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/mtio\/assets\/pages\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).asp$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/mtio/assets/pages/bclar/sndbclar.asp
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/resources\/guidedtours\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/guidedtours/nationalism/06_verdi_giuseppe?_pjax=%23main
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  } else if ((match = /^\/resources\/opera\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_%-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/opera/synopses/elegy%20for%20young%20lovers?f=e&_pjax=%23main
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  } else if ((match = /^\/resources\/opera\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/opera/libretto/haydn/the_creation/english/part_2
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[2] + '/' + match[3] + '/' + match[4] + '/' + match[5];

  } else if (((match = /^\/works\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/work\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null)) {
    // https://emory.nml3.naxosmusiclibrary.com:443/work/117491?type=analysis&_pjax=%23main
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/sharedfiles\/booklets\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // https://emory.naxosmusiclibrary.com:443/sharedfiles/booklets/CHA/booklet-CHAN20141.pdf
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.unitid   = match[2];

  } else if ((match = /^\/arthur\/data\/([a-zA-Z0-9_-]+).mp3$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/arthur/data/canada.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[1];

  } else if ((match = /^\/media\/aacstorage\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).mp4$/i.exec(path)) !== null) {
    // https://audiostream.naxosmusiclibrary.com:443/media/aacstorage/aac128k/nac/383871_01_full_128.mp4?dlauth=1565893683_ab51a603d9caa624e21b755d97b81290
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[3];

  } else if (/^\/mediaplayer\/player.asp$/i.test(path)) {
    // https://emory.naxosspokenwordlibrary.com:443/mediaplayer/player.asp?br=64&tl=963139%7C963140%7C963141%7C963142%7C963143%7C963144%7C963145%7C963146%7C963147%7C963148%7C963149%7C963150%7C963151%7C963152%7C963153%7C963154%7C963155%7C963156%7C963157%7C963158%7C963159%7C963160%7C963161%7C963162%7C963163%7C963164%7C963165%7C963166%7C963167%7C963168%7C963170%7C963171%7C963172%7C963173%7C963174%7C963175%7C963176%7C963177%7C963178%7C963179%7C963180%7C963181%7C963182%7C963183%7C963184%7C963185%7C963186%7C963187%7C963188%7C963189%7C963190%7C963191%7C963192%7C963193%7C963194%7C963195%7C963196%7C963197%7C963198%7C963199&domain=emory.naxosspokenwordlibrary.com&pl_token=CB07DBA7-A441-4D50-80D8-2EA3C796E21A&forceFlash=0&tracktoplay=&tp=
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = param.tl;

  } else if ((match = /^\/resources\/pronunciation\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_%-]+).mp3$/i.exec(path)) !== null) {
    // http://www.naxosmusiclibrary.com:80/resources/pronunciation/american/americapron_002.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/title\/([a-zA-Z0-9_.-]+)/i.exec(path)) !== null) {
    // http://emory.naxosvideolibrary.com:80/title/2.110291/
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = match[1];

  } else if (((match = /^\/resources\/juniorsection\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/resources\/juniorsection\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null)) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/juniorsection/historyofopera
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/juniorsection/historyofclassicalmusic/
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/resources\/juniorsection\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/juniorsection/historyofclassicalmusic/part2
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/resources\/studyarea\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/studyarea/ireland/chapter02?_pjax=%23main
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];

  } else if (((match = /^\/resources\/studyarea\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\.([a-z]+)$/i.exec(path)) !== null) || ((match = /^\/default.asp$/i.exec(path)) !== null)) {
    // https://emory.naxosmusiclibrary.com:443/resources/studyarea/ireland/default.asp?content=Chapter02
    // https://emory.naxosmusiclibrary.com:443/default.asp?page_name=resources&label=studyarea1&path=09_Music_of_the_Twentieth_Century.htm
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = param.content || param.path;

  } else if ((match = /^\/resources\/studyarea\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://emory.nml3.naxosmusiclibrary.com:443/resources/studyarea/aus/gentop/09_music_of_the_twentieth_century?_pjax=%23main
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];

  }

  return result;
});
