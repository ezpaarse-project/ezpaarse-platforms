#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Tumblebooks
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

  if ((match = /^\/([a-z]+).aspx$/i.exec(path)) !== null) {
    result.mime     = 'HTML';
    const pageName = match[1].toLowerCase();
    switch (pageName) {
    case 'default': {
      // https://www.tumblebooklibrary.com/Default.aspx?ReturnUrl=/TumbleSearch.aspx
      result.rtype ='OTHER';
      break;
    }
    case 'home': {
      result.rtype    = 'OTHER';
      break;
    }
    case 'bookslist': {
      // https://www.tumblebooklibrary.com/BooksList.aspx?categoryID=77
      result.rtype    = 'OTHER';
      break;
    }
    case 'tumblesearch': {
      // https://www.tumblebooklibrary.com/TumbleSearch.aspx
      result.rtype    = 'SEARCH';
      break;
    }
    case 'result': {
      // https://www.tumblebooklibrary.com/Result.aspx?m=Title&key=pie
      result.rtype    = 'SEARCH';
      break;
    }
    case 'book': {
      // https://www.tumblebooklibrary.com/book.aspx?id=4229
      result.rtype    = 'RECORD';
      result.title_id = param.id;
      result.unitid = param.id;
      break;
    }
    case 'video': {
      // https://www.tumblebooklibrary.com/Video.aspx?ProductID=4229
      result.rtype    = 'BOOK';
      result.title_id = param.ProductID;
      result.unitid = param.ProductID;
      break;
    }
    case 'viewonline': {
      // https://www.tumblebooklibrary.com/ViewOnline.aspx?Is5=true&ProductID=6219
      result.rtype    = 'BOOK';
      result.title_id = param.ProductID;
      result.unitid = param.ProductID;
      break;
    }
    case 'raplayer': {
      // https://www.tumblebooklibrary.com/RAPlayer.aspx?ProductID=5791
      result.rtype    = 'BOOK';
      result.title_id = param.ProductID;
      result.unitid = param.ProductID;
      break;
    }
    }
  } else if ((match = /^\/H5Player.aspx\/$/i.exec(path)) !== null) {
    // https://www.tumblebooklibrary.com/H5Player.aspx/?ProductID=7075&book=%2FH5Books%2FTBLEN%2Fbooks%2Fbabyanimalsplaying%2Fbabyanimalsplaying.json&page=0
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = param.ProductID;
    result.unitid = param.ProductID;
  } else if ((match = /^\/H5GamePlayer.aspx\/([^/]+)$/i.exec(path)) !== null) {
    // https://www.tumblebooklibrary.com/H5GamePlayer.aspx/match-the-sentence?ProductID=7247&game=%2FH5Games%2FMatchSentence%2FTBLEN%2FAbraCadabraAndTheToothWitchSentenceGame.json
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = param.ProductID;
    result.unitid = param.ProductID;
  }
  return result;
});
