#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/default.aspx$/i.exec(path)) !== null) {
    if (param.sText !== null) {
    // http://search.eiu.com:80/default.aspx?sText=potato
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    }
  } else if ((match = /^\/([A-z-]+)$/i.exec(path)) !== null) {
    // http://country.eiu.com:80/united-kingdom
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/([A-z_-]+)\/([A-z_-]+)$/i.exec(path)) !== null) {
    // http://www.eiu.com:80/industry/Telecommunications
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/([A-z_-]+)\/([A-z_-]+)\/([A-z_-]+)$/i.exec(path)) !== null) {
    // http://www.eiu.com:80/industry/financial-services/theme
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/([A-z_-]+)\/([A-z_-]+)\/([A-z_-]+)\/([A-z_-]+)$/i.exec(path)) !== null) {
    // http://country.eiu.com:80/Ghana/ArticleList/Updates/Politics
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/([A-z_-]+)\/([A-z_-]+)\/([A-z_-]+)\/([0-9]+)\/([A-z_-]+)$/i.exec(path)) !== null) {
    // http://www.eiu.com:80/industry/telecommunications/company/210029221/telstra
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/industry\/article\/([0-9]+)\/([A-z0-9-]+)\/([0-9-]+)$/i.exec(path)) !== null) {
    // http://www.eiu.com:80/industry/article/2000497984/usa-food-us-potato-giant-bets-on-biotech-potatoes/2013-05-15
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/index.asp$/i.exec(path)) !== null) {
    // http://viewswire.eiu.com:80/index.asp?layout=VWArticleVW3&article_id=725731056
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = param.article_id;
    result.unitid   = param.article_id;
  } else if ((match = /^\/article.aspx$/i.exec(path)) !== null) {
    if (param.subtopic == 'Charts and tables') {
    // http://country.eiu.com:80/article.aspx?articleid=1357877519&Country=Ghana&topic=Economy&subtopic=Charts+and+tables&subsubtopic=Annual+data+and+forecast
      result.rtype    = 'DATA';
      result.mime     = 'HTML';
      result.title_id = param.articleid;
      result.unitid   = param.articleid;
    }
    if (param.subtopic !== 'Charts and tables') {
    // http://country.eiu.com:80/article.aspx?articleid=1987582182
    // http://country.eiu.com:80/article.aspx?articleid=107592994&Country=Germany&topic=Economy&subtopic=Forecast&subsubtopic=Policy+trends
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.title_id = param.articleid;
      result.unitid   = param.articleid;
    }
  } else if ((match = /^\/handlers\/filehandler.ashx$/i.exec(path)) !== null) {
    // http://industry.eiu.com:80/handlers/filehandler.ashx?issue_id=777081261&mode=pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.issue_id;
    result.unitid   = param.issue_id;
  } else if ((match = /^\/Handlers\/WhitepaperHandler.ashx$/i.exec(path)) !== null) {
    // http://www.eiu.com:80/Handlers/WhitepaperHandler.ashx?fi=Democracy_Index_2018.pdf&mode=wp&campaignid=Democracy2018
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.fi;
    result.unitid   = param.fi;
  } else if ((match = /^\/FileHandler.ashx$/i.exec(path)) !== null) {
    // http://country.eiu.com:80/FileHandler.ashx?issue_id=1017877485&mode=pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.issue_id;
    result.unitid   = param.issue_id;
  } else if ((match = /^\/EIUTableView.aspx$/i.exec(path)) !== null) {
    // http://data.eiu.com:80/EIUTableView.aspx?initial=true&pubtype_id=1353181320
    result.rtype    = 'DATA';
    result.mime     = 'HTML';
    result.title_id = param.pubtype_id;
    result.unitid   = param.pubtype_id;
  }

  return result;
});
