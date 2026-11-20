#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Newsbank
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

  // Readex interface
  if ((match = /^\/apps\/readex\/publication-browse$/i.exec(path)) !== null) {
    // /apps/readex/publication-browse?p=WHNPLAN2&t=pubname%3A143F4F589260D53A%21Constitucional&year=1841
    // /apps/readex/publication-browse?p=WHNPLAN2&t=pubname%3A144D3CBB48E30063%21Actualidad&year=1885

    // TOC: unitid = t without pubname prefix; do not double-encode
    result.rtype = 'TOC';
    result.mime  = 'HTML';

    result.pii   = param.p;

    if (param.t) {
      let unitid = param.t.replace(/^pubname:/i, '');
      if (param.year) {
        unitid += '&year=' + param.year;
      }

      result.unitid = unitid;
    }

  } else if ((match = /^\/apps\/readex\/doc$/i.exec(path)) !== null) {
    // /apps/readex/doc?p=WHNPLAN2&t=pubname%3A14162DB8586F8CA3%21Mercurio%2Bde%2BValparaiso&sort=YMD_date%3AA&fld-base-0=alltext&val-base-0=Chile&val-database-0=&fld-database-0=database&fld-nav-0=YMD_date&val-nav-0=&docref=image/v2%3A14162DB8586F8CA3%40WHNPLAN2-141FAC22C46A5348%402388612-141FA560B99E2EE0%402-141FA560B99E2EE0%40&firsthit=yes
    // /apps/readex/doc?p=WHNPLAN2&sort=YMD_date%3AA&fld-base-0=alltext&val-base-0=Venezuela&val-database-0=&fld-database-0=database&fld-nav-0=YMD_date&val-nav-0=&docref=image/v2%3A143FAA13A9519E23%40WHNPLAN2-14C42965EAF72158%402386552-14C3CC5A612E3B70%403-14C3CC5A612E3B70%40&firsthit=yes

    // ARTICLE (PDF): unitid = docref after '<p>-', URL-encoded form
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

    result.pii   = param.p;
    if (param.docref && param.p) {
      result.unitid = param.docref.split(param.p + '-')[1];
    }

  } else if ((match = /^\/apps\/readex\/results$/i.exec(path)) !== null) {
    // /apps/readex/results?p=WHNPLAN2&fld-base-0=alltext&val-base-0=Venezuela&sort=YMD_date%3AA&val-database-0=&fld-database-0=database&fld-nav-0=YMD_date&val-nav-0=
    // /apps/readex/results?p=WHNPLAN2&fld-base-0=alltext&val-base-0=Iran&sort=YMD_date%3AA&val-database-0=&fld-database-0=database&fld-nav-0=YMD_date&val-nav-0=
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

    result.pii   = param.p;

  } else if ((match = /^\/apps\/news\/results$/i.exec(path)) !== null) {
    // /apps/news/results?p=AMNEWS&fld-base-0=alltext&sort=YMD_date%3AD&maxresults=20&val-base-0=Ginther&t=favorite%3A1467499E%21Columbus%2520Dispatch%2520Historical%2520and%2520Current
    // /apps/news/results?p=NewsBank&fld-base-0=alltext&sort=YMD_date%3AD&maxresults=20&val-base-0=H1N1&t=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

    result.title_id = param.t.split('!')[1];
    result.pii      = param.p;

  } else if ((match = /^\/resources\/search\/nb$/i.exec(path)) !== null) {
    // /resources/search/nb?p=OBIT&t=state%3AIL%21USA%2B-%2BIllinois
    // /resources/search/nb?p=OBIT&b=results&t=state%3AIL%21USA%2B-%2BIllinois&fld0=dece&val0=Duffy&bln1=AND&fld1=YMD_date&val1=&bln2=AND&fld2=doc_body&val2=&sort=YMD_date%3AD&page=0
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

    result.pii   = param.p;

  } else if ((match = /^\/resources\/doc\/nb\/obit\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /resources/doc/nb/obit/175A318630BE6C90-175A318630BE6C90?p=OBIT
    result.rtype  = 'RECORD';
    result.mime   = 'HTML';

    result.unitid = match[1];
    result.pii    = param.p;

  } else if ((match = /^\/iw-search\/we\/Static$/i.exec(path)) !== null) {
    // /iw-search/we/Static?p_product=Space&f_location=space&p_theme=current&p_action=doc&p_nbid=J50L52JHMTYwMjE4MjIzMC42MDYyNzg6MToxNDoxMzIuMTc0LjI1MC45NQ&f_docnum=17DF632D56E33508&f_topic=1&f_prod=BRFB&f_type=&d_refprod=SPECIALREPORTS
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';

    result.unitid = param.f_docnum;

  } else if ((match = /^\/apps\/news\/document-view$/i.exec(path)) !== null) {
    // /apps/news/document-view?p=AMNEWS&t=pubname%3A11A73E5827618330%21Oregonian&sort=YMD_date%3AD&fld-base-0=alltext&maxresults=20&val-base-0=portland&docref=image/v2%3A11A73E5827618330%40EANX-NB-132AEA35E5DCD707%402447161-132AE92168CBD33E%404-132AE92168CBD33E%40
    // /apps/news/document-view?p=NewsBank&t=&sort=YMD_date%3AD&fld-base-0=alltext&maxresults=20&val-base-0=H1N1&docref=news/17DFAD1BF786C478

    // docref=news/... (legacy) or docref=image/... (unitid = encoded value after 'image/')
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

    result.unitid   = param.docref.split('/')[1];
    result.title_id = param.t.split('!')[1];
    result.pii      = param.p;

  } else if ((match = /^\/explore\/document$/i.exec(path)) !== null) {
    // Explore interface (2026)
    // /explore/document?p=AWNB&t=pubname%3ADLOB%21Oklahoman%252C%2BThe%2B%28Oklahoma%2BCity%252C%2BOK%29%2Fyear%3A2026%212026%2Fmody%3A1117%21November%2B17%252C%2B2026&action=browse&docref=news%2F1ABF1E578F9B8778&format=text
    // /explore/document?p=WORLDNEWS&t=pubname%3AOOK9-EEDT%21Oklahoman%252C%2BThe%2B%28Oklahoma%2BCity%252C%2BOK%29%2Fyear%3A2026%212026%2Fmody%3A1117%21November%2B17%252C%2B2026&action=browse&docref=image%2Fv2%3A17AA045809B8AD90%40AWNB-1ABEC877AA53ECCF%402461362-1ABEE6F044AFDA0D%400&format=image
    // /explore/document?p=AWNB&t=state%3AOK%21Oklahoma+News+Sources&sort=YMD_date%3AD&val-base-0=Oklahoman&fld-base-0=alltext&currentHitNumber=1&docref=image%2Fv2%3A17AA045809B8AD90%40AWNB-1ABEC877AA53ECCF%402461362-1ABEDF0649E7F2D6%4015-1ABEDF0649E7F2D6%40&hide_duplicates=2&intent=0&maxresults=60

    // Requests carrying _rsc are Next.js client fetches of a page already requested: not counted
    if (param.docref && !param._rsc) {
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';

      result.unitid   = param.docref.split('/')[1];
      result.title_id = exploreTitle(param.t);
      result.pii      = param.p;
    }

  } else if ((match = /^\/explore\/results$/i.exec(path)) !== null) {
    // /explore/results?p=AWNB&t=state%3AOK%21Oklahoma+News+Sources&sort=YMD_date%3AD&val-base-0=Oklahoman&fld-base-0=alltext&hide_duplicates=2&intent=0&maxresults=60
    // /explore/results?p=WORLDNEWS&t=favorite%3AOWEAODLO%21The+Oklahoman+Collection+1901+to+Current&sort=YMD_date%3AD&val-base-0=%22James+G.+Robedeaux%22&fld-base-0=alltext&hide_duplicates=2&intent=0&maxresults=60
    if (!param._rsc) {
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';

      result.title_id = exploreTitle(param.t);
      result.pii      = param.p;
    }

  } else if ((match = /^\/explore\/(browse-pub|issue-browse)$/i.exec(path)) !== null) {
    // /explore/browse-pub?p=AWNB&t=pubname%3ATWOK-EEDT%21Tulsa%2BWorld%2B%28OK%29&action=browse
    // /explore/browse-pub?p=AWNB&t=pubname%3AOOK9-EEDT%21Oklahoman%252C%2BThe%2B%28Oklahoma%2BCity%252C%2BOK%29&action=browse&year=2026
    // /explore/issue-browse?p=AWNB&t=pubname%3ADLOB%21Oklahoman%252C%2BThe%2B%28Oklahoma%2BCity%252C%2BOK%29%2Fyear%3A2026%212026%2Fmody%3A1117%21November%2B17%252C%2B2026&action=browse&format=text
    // /explore/issue-browse?p=AWNB&t=pubname%3ABTB2B%21Bethany%2BTribune%2B%28OK%29%2Fyear%3A2026%212026%2Fmody%3A1113%21November%2B13%252C%2B2026&action=browse&format=text
    if (!param._rsc && param.t) {
      result.rtype    = 'TOC';
      result.mime     = 'HTML';

      // unitid = t without pubname prefix (plus year), same as the Readex publication-browse rule
      let unitid = param.t.replace(/^pubname:/i, '');
      if (param.year) {
        unitid += '&year=' + param.year;
      }

      result.unitid   = unitid;
      result.title_id = exploreTitle(param.t);
      result.pii      = param.p;
    }

  }

  return result;
});

/**
* Explore interface: t is "<type>:<code>!<title>[/year:...!.../mody:...!...]"
* Returns the title part only
*/
function exploreTitle(t) {
  if (!t || t.indexOf('!') === -1) { return undefined; }
  return t.split('!')[1].split('/')[0].trim();
}
