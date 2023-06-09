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
  /^\/(search|label|persons|recentaddi?tions|newreleases|filtered)\/[a-z0-9_-]+\/?$/i,
  /^\/(search|label|persons|composer?s|recentaddi?tions|news|resources|catcategory)\/?$/i,
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
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if (searchPatterns.some(p => p.test(path))) {
    // /jazz/browsesearch.asp?genreid=434&CategoryID=202
    // /jazz/browsesearchlabel.asp?catlabelid=CEL
    // /jazz/composerlist.asp
    // /jazz/labels.asp
    // /World/artistlist.asp
    // /World/browsesearchlabel.asp?catlabelid=GLO
    // /World/composerlist.asp
    // /World/culturalgrouplist.asp
    // /World/labels.asp
    // /World/GeoMap/SearchByRegion.asp?tab=Alphabetical&alpha=P
    // /World/GeoMap/SearchByRegion.asp
    // /composers/
    // /composers/browse
    // /composers/browse/M
    // /jazz/google/result.asp?q=herbie+handcock&ie=&output=xml_no_dtd&oe=utf-8&getfields=*&start=0&num=20&filter=0&requiredfields=-RestrictedCountry%3AUS&site=nmlj_collection&client=nmlj_frontend&proxystylesheet=nml_family&skin=jazz&label=Label&artist=Artist&country=Country&composer=Composer&category=Category&emmain=/jazz/google/result.asp&hideImages=false
    // /world/google/result.asp?site=world_collection&client=world_frontend&proxystylesheet=nml_family&output=xml_no_dtd&partialfields=%28artist%3ABeethoven%7Cconductor%3ABeethoven%29&requiredfields=-RestrictedCountry%3AUS&filter=p&getfields=*&q=&skin=world&label=Label&artist=Artist&country=Country&composer=Composer&period=Period&emmain=%2Fworld%2Fgoogle%2Fresult.asp&hideImages=true&category=Category&num=10
    // /world/google/result.asp?site=world_collection&client=world_frontend&proxystylesheet=nml_family&output=xml_no_dtd&partialfields=%28artist%3AJones%7Cconductor%3AJones%29&requiredfields=-RestrictedCountry%3AUS&filter=p&getfields=*&q=&skin=world&label=Label&artist=Artist&country=Country&composer=Composer&period=Period&emmain=%2Fworld%2Fgoogle%2Fresult.asp&hideImages=true&category=Category&num=10
    // /jazz/playlists/playlist.asp
    // /World/playlists/playlist.asp
    // /artist/search?pkeyword=jones&_pjax=%23main
    // /composer/search?pkeyword=bach&_pjax=%23main
    // /englishtitles.asp
    // /frenchtitles.asp
    // /germantitles.asp
    // /portuguesetitles.asp
    // /authorList.asp
    // /browsesearch.asp?p_strSelCountry=EN&CategoryID=53
    // /browsesearchlabel.asp?catlabelid=CDS
    // /catcategory?_pjax=%23main
    // /category/211/All/1?_pjax=%23main
    // /category/211/D/1?_pjax=%23main
    // /filtered/ballet/?sortby=composer
    // /google/result.asp?q=becket&ie=&output=xml_no_dtd&oe=utf-8&getfields=*&start=0&num=20&filter=0&requiredfields=-RestrictedCountry%3AUS&site=nswl_collection&client=nswl_frontend&proxystylesheet=nml_family&skin=nswl&label=Publisher(s)&artist=Reader&country=Country&composer=Author&category=Category&emmain=/google/result.asp&hideImages=false
    // /label?_pjax=%23main
    // /label/BAN/
    // /labels.asp
    // /newreleases.asp
    // /newreleases/category?_pjax=%23main
    // /newreleases/label?_pjax=%23main
    // /newreleases/category/211
    // /newreleases/label/CNR
    // /news?_pjax=%23main
    // /persons/a/?person_type=choir
    // /persons/?person_type=choir
    // /readerlist.asp?filter=t
    // /ReaderList.asp
    // /recentadditions.asp
    // /recentaddtions?_pjax=%23main
    // /recentaddtions/data?dateRange=2019-08-08&showType=1
    // /resources?_pjax=%23main
    // /resources/opera/libretto
    // /pronunciation/artist
    // /search?keyword=beethoven&page=1&_pjax=%23main
    // /search?workcatid=60
    // /search/?search=beethoven
    // /work/127223/

    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/(world|jazz)\/([a-z0-9_-]+).asp$/i.exec(path)) !== null) {
    if (match[2] === 'artist_pro_new') {
      // /World/artist_pro_new.asp?personid=32318
      result.rtype = 'TOC';
      result.mime = 'HTML';
      result.unitid = param.personid;

    } else if (match[2] === 'culturalgroupinfo') {
      // /World/culturalgroupinfo.asp?id=ANA
      result.rtype = 'TOC';
      result.mime = 'HTML';
      result.unitid = param.id;

    } else if (match[2] === 'featuredarticles') {
      // /world/featuredarticles.asp?art=Mali
      // /world/featuredarticles.asp?art=Tango
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      result.unitid = param.art;

    } else if (match[2] !== null) {
      // /jazz/artistlist.asp
      result.rtype = 'SEARCH';
      result.mime = 'HTML';

    }
  } else if ((match = /^\/resources\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    if (match[1] === 'playlist') {
      // /resources/playlist?tab=omea
      result.rtype = 'TOC';
      result.mime = 'HTML';
      result.unitid = match[1];

    } else if (match[1] === 'work-analyses') {
      // /resources/work-analyses
      result.rtype = 'TOC';
      result.mime = 'HTML';
      result.unitid = match[1];

    } else if (match[1] !== null) {
      // /resources/audiobooks
      result.rtype = 'SEARCH';
      result.mime = 'HTML';
      result.unitid = match[1];

    }
  } else if ((/^\/catalogue\/item\.asp$/i.test(path)) || (/^\/folder$/i.test(path)) || (/^\/naxos\/track\/trackListByIds$/i.test(path))) {
    // /catalogue/item.asp?cid=NA443812
    // /naxos/track/trackListByIds?ids=4168074%2C4168075%2C4168076%2C4168077%2C4168078%2C4168079%2C4168080%2C4168081%2C4168082%2C4168083%2C4168084%2C4168085%2C4168086%2C4168087%2C4168088%2C4168089%2C4168090%2C4168091%2C4168092%2C4168093%2C4168094%2C4168095%2C4168096%2C4168097%2C4168098&quality=
    // /folder?category=nml&_pjax=%23main
    // /folder?category=unv&folderId=74146&_pjax=%23main
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.cid || param.category || param.ids;

  } else if (/^\/([a-z0-9_-]+)\/catalogue\/item\.asp$/i.test(path)) {
    // /jazz/catalogue/item.asp?cid=CD-4835
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.cid;

  } else if (/^(\/[a-z0-9_-]+)?\/composer\/btm\.asp$/i.test(path) || /^\/artist_pro_new\.asp$/i.test(path)) {
    // /composer/btm.asp?composerid=333317
    // /World/composer/btm.asp?composerid=252742
    // /artist_pro_new.asp?personid=238263
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.composerid || param.personid;

  } else if ((match = /^\/([a-z0-9_-]+)\/GeoMap\/GeoMapApi\.asp$/i.exec(path)) !== null) {
    // /World/GeoMap/GeoMapApi.asp?cmd=GetCountryListByRegion&region=053
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.region;

  } else if ((match = /^\/label\/([a-z0-9_-]+\/[a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /label/BLI/-1/1?_pjax=%23main
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/guidedtours\/([a-z0-9_-]+)\/$/i.exec(path)) !== null) {
    // /resources/guidedtours/20thcentury/
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/studyarea\/([a-z0-9_-]+)\/$/i.exec(path)) !== null) {
    // /resources/studyarea/ireland/
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/studyarea\/([a-z0-9_-]+\/[a-z0-9_-]+)\/$/i.exec(path)) !== null) {
    // /resources/studyarea/aus/gentop/
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/work-analyses\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /resources/work-analyses/20_nielsen_carl?_pjax=%23main
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/work\/[a-z0-9_-]+\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /work/catalogue/117491
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/catalogue\/([a-z0-9_-]+)/i.exec(path)) !== null) {
    // /catalogue/FB1904783?_pjax=%23main
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/arthur\/(data\/[a-z0-9_-]+).htm$/i.exec(path)) !== null) {
    // /arthur/data/booklet.htm
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/mtio\/assets\/pages\/([a-z0-9_-]+)\.asp$/i.exec(path)) !== null) {
    // /mtio/assets/pages/transp.asp
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/mtio\/assets\/pages\/([a-z0-9_-]+\/[a-z0-9_-]+)\.asp$/i.exec(path)) !== null) {
    // /mtio/assets/pages/bclar/sndbclar.asp
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/guidedtours\/([a-z0-9_-]+)\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /resources/guidedtours/nationalism/06_verdi_giuseppe?_pjax=%23main
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = match[2];

  } else if ((match = /^\/resources\/opera\/([a-z0-9_-]+)\/([a-z0-9_%-]+)$/i.exec(path)) !== null) {
    // /resources/opera/synopses/elegy%20for%20young%20lovers?f=e&_pjax=%23main
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = match[2];

  } else if ((match = /^\/resources\/opera\/[a-z0-9_-]+\/([a-z0-9_-]+\/[a-z0-9_-]+\/[a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /resources/opera/libretto/haydn/the_creation/english/part_2
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if (((match = /^\/works\/([a-z0-9_-]+)$/i.exec(path)) !== null)) {
    // /works/525150
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.db_id = 'works';

  }
  else if (((match = /^\/work\/([a-z0-9_-]+)$/i.exec(path)) !== null)) {
    // /work/117491?type=analysis&_pjax=%23main
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/sharedfiles\/booklets\/[a-z0-9_-]+\/([a-z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // /sharedfiles/booklets/CHA/booklet-CHAN20141.pdf
    result.rtype = 'RECORD_VIEW';
    result.mime = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/arthur\/data\/([a-z0-9_-]+)\.mp3$/i.exec(path)) !== null) {
    // /arthur/data/canada.mp3
    // /arthur/data/four.htm
    // /arthur/data/seven.htm
    // /arthur/data/canada.mp3
    // /arthur/data/czech.mp3
    result.rtype = 'AUDIO';
    result.mime = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/media\/aacstorage\/[a-z0-9_-]+\/[a-z0-9_-]+\/([a-z0-9_-]+)\.mp4$/i.exec(path)) !== null) {
    // /media/aacstorage/aac128k/bli/fz0786_001_full_128.mp4?dlauth=1565892996_eeb9e1428b4b470f2b3c512972dd6e08
    result.rtype = 'AUDIO';
    result.mime = 'MISC';
    result.unitid = match[1];

  } else if (/^\/mediaplayer\/player\.asp$/i.test(path)) {
    // /mediaplayer/player.asp?br=64&domain=emory.naxosspokenwordlibrary.com&pl_token=CB07DBA7-A441-4D50-80D8-2EA3C796E21A&forceFlash=0&tracktoplay=&tp=
    result.rtype = 'AUDIO';
    result.mime = 'MISC';
    result.unitid = param.tl;

  } else if ((match = /^\/resources\/pronunciation\/([a-z0-9_-]+\/[a-z0-9_%-]+)\.mp3$/i.exec(path)) !== null) {
    // /resources/pronunciation/american/americapron_002.mp3
    result.rtype = 'AUDIO';
    result.mime = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/title\/([a-z0-9_.-]+)/i.exec(path)) !== null) {
    // /title/2.110291/
    // /title/L7922DVD
    result.rtype = 'VIDEO';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if (((match = /^\/resources\/juniorsection\/([a-z0-9_-]+)\/?$/i.exec(path)) !== null)) {
    // /resources/juniorsection/historyofopera
    // /resources/juniorsection/historyofclassicalmusic/
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/juniorsection\/([a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /resources/juniorsection/historyofclassicalmusic/part2
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/resources\/studyarea\/([a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /resources/studyarea/ireland/chapter02?_pjax=%23main
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if (/^\/resources\/studyarea\/([a-z0-9_-]+)\/([a-z0-9_-]+)\.([a-z]+)$/i.test(path) || /^\/default\.asp$/i.test(path)) {
    // /resources/studyarea/ireland/default.asp?content=Chapter02
    // /default.asp?page_name=resources&label=studyarea1&path=09_Music_of_the_Twentieth_Century.htm
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = param.content || param.path;

  } else if ((match = /^\/resources\/studyarea\/([a-z0-9_-]+\/[a-z0-9_-]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /resources/studyarea/aus/gentop/09_music_of_the_twentieth_century?_pjax=%23main
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z0-9_-]+\/catalogue\/([a-z-0-9_-]+)$/i.exec(path)) !== null) {
    // /jazz/catalogue/SAVANT-CD2183
    // /jazz/catalogue/HS223VL
    // /world/catalogue/76032-2
    // /World/catalogue/item.asp?cid=GCD921002
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/media\/videostorage\/([a-z-0-9_.-]+)$/i.exec(path)) !== null) {
    // /media/videostorage/l7922dvd.2mb.part1.mp4?dlauth=1638189734_1ae1e698dc1e0009862636398342996a
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    result.unitid = match[1].split('.mp4')[0];

  } else if ((match = /^\/(world|jazz)\/naxos\/track\/streamLog$/i.exec(path)) !== null) {
    // /world/naxos/track/streamLog?trackId=69669&quality=128
    // /jazz/naxos/track/streamLog?trackId=38031&quality=128
    result.rtype = 'AUDIO';
    result.mime = 'MISC';
    result.unitid = param.trackId;

  } else if ((match = /^\/composers\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /composers/26063
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/naxos\/track\/audio\/address$/i.exec(path)) !== null) {
    // /naxos/track/audio/address?trackId=5511058&quality=128
    result.rtype = 'AUDIO';
    result.mime = 'HTML';
    result.unitid = param.trackId;

  } else if ((match = /^\/([a-z]+)\/naxos\/track\/audio\/address$/i.exec(path)) !== null) {
    // /world/naxos/track/audio/address?trackId=5521823&quality=128
    result.rtype = 'AUDIO';
    result.mime = 'HTML';
    result.unitid = param.trackId;
    result.db_id = match[1];

  } else if ((match = /^\/artist\/([0-9]+)$/i.exec(path)) !== null) {
    // /artist/168217
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/person\/([0-9]+)$/i.exec(path)) !== null) {
    // /person/57824
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/artist\/([a-z]+)$/i.exec(path)) !== null) {
    // /artist/s
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/(?:artist)|(?:composer)$/i.exec(path)) !== null) {
    // /artist?_pjax=%23main
    // /composer?_pjax=%23main
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if (/^\/(?:composer)\/[a-z0-9]+$/i.test(path)) {
    // /composer/H?_pjax=%23main
    // /composer/29268?_pjax=%23main
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  }
  return result;
});
