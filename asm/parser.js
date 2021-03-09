#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Society of Metals
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/([a-z-]+)\/search-results$/i.exec(path)) !== null) {
    // https://dl.asminternational.org/handbooks/search-results?page=1&q=alloy&fl_SiteID=1000003
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-z-]+)\/article\/([0-9]+)\/([0-9]+)\/([0-9a-z-]+)\/([0-9]+)\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://dl.asminternational.org/alloy-digest/article/41/1/Ni-400/5523/TOPHEL-ALLOY-NIAL-ALLOY-NICROSIL-NISIL-ALLOYS-20?searchresult=1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
  } else if ((match = /^\/([a-z-]+)\/book\/([0-9]+)\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://dl.asminternational.org/handbooks/book/36/Alloy-Phase-Diagrams
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[3];
  } else if ((match = /^\/([a-z-]+)\/book\/([0-9]+)\/chapter\/([0-9]+)\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://dl.asminternational.org/handbooks/book/36/chapter/474152/Introduction-to-Phase-Diagrams-1
    // https://dl.asminternational.org/failure-analysis/book/84/chapter/1868788/Explosion-of-the-Terra-Ammonium-Nitrate-Plant-Port
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
  } else if ((match = /^\/([0-9a-z-_]+)\.pdf$/i.exec(path)) !== null) {
    // https://watermark.silverchair.com/a0006221.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAAnMwggJvBgkqhkiG9w0BBwagggJgMIICXAIBADCCAlUGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMUoVMpnNxbCfUse6KAgEQgIICJvlvec6VQuvfNPdy_SbN-oGgrYaLwqHc2MqFkJIoT5Ml3P5l6WFOormY-oazfsB0MB_KMyyLXmLdVomc8rqaMCfLFi-vXKgvfecTfdwQh0a1it_OnwzhXPej4PdES8Dh27oOY2pK_4pxO4i5_02PB_Keklsi2VC4Lgkfem1yQDoQvYFsxjYVIeklH1Nqpc3d0YqgSp_2GYE39CdeulHrUfkIOHxaJd7s85soWcOMaa2sXxPx8U5IN8ZTlzGpKiOIy4pjG8k89-nhEOxaqf6yeKxmtfdXQLe9K1jpDlOuTsBnKIvqYG8gDeupBgqwoVpnptWxikGgsSjGLJADk9nS_EMSTgSHqr6jCOA4rZMpAxbEG-DyEmxHETx9B2q8NdeKtrYcc6GkV1g4qDCwZKahL5zDtRmxI2DHuDN7KFBd3R3wdoVoD-gKyexnONrm0rSQZQQf0cKkq0Fb_0caGyD_JsuM23pbWuyJI7PBNFruFCDfsyQ43pqUudSNalVyky-koc61Q89Aj8qiv7WGAdl2ZdjkTO3WUZbNBXXjBUIdPL3vvNv8xGMMRzmoxz3mTs7Nm4vKvW0skXv3agizdGhbkOatV8JeHQRjOP8ZCAn3RIsnbVNxPdvnyQY6Q6VAcEgo-XYl0E1VVQb4O9G5LtKEfnUyehtv5U7Ia45YfLN25RrE-rbCRvKWYYGvK5V0jY1XvgknK4KOR2gJXBCUEDlCgbYcV5qdt2U
    // https://watermark.silverchair.com/ad_v41_01_ni-400.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAA7YwggOyBgkqhkiG9w0BBwagggOjMIIDnwIBADCCA5gGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM5p-4LajOZFa-g1iJAgEQgIIDaVKmeRniRJ-EQ6lKXoy9NAQxKmIUZkGJQ2tLJX0bHwfjkOk8_YfjRt8NBE-a3OxICqI9M-ix8IieOCtqItfFMK03tfYxP42-rtfEjFT4VhfqcE5ciXYPfWh_PFXyEDl9wqyHlOnkG2F-CGTnxaxrDWrmlZbWQaXk6SoLkHJFXh3P8GeDV-CUJZWA3Xk9jCjHzPvjuLhx2bEkyrK95ttzamuCDzGIyWrE6MSPEOfkk3WbLYDVXIqh4vHd6XvU4F8xlzArHz7jGEoy4_LV0Yo4lW-wnSbgI4_q3L9FUEcA77tkM2xj1JMDhi6JpgkkG0XQ7DhvavAxWJgUVB4E2vaXrj3swX7nc4j6xPa7IZL8KmszaGC8ix2a04uyT3PnO7LRwMWNivAWypCqJ7roYVLFK20DO8LLekOnDcHuo6ncptNOdK16Oy0fNwpMHueKwpLv1lcF6aYjRjUJCpFBnGVoY7DB1d_zg9hlcg4cIP5f3VeA5eagotbaJNohxxOG7bAJbj6gINpNC1xMezJYJvBPJN6zNfB0_Ez9yJqUOp8jmIpfdwgEl_Bo5dVMQlnOXdPgNReXVXb9-ijB7Dqd9DgmRVcp_5uyxLkifCDIZtmE3j0y0Jmykxe5pzmHSvMx2tNZx9NU7e-nuO2BwFkJjv-KTEiFUesaXXUdnkH6PkQWuPySMgMMydXlASL8WcIlcxG8EiHpsWQa_bJVA462pc46aNZmmIBhIzMPc4TDWE_M3aumbPhykypgfpCh6CJuJiVmXwy5mBx5SMf3nGcxnvEz8EBzKWcw-s9J-WFn5ERegAZGdhYxRfZGemstpeDAz78MvkA1zq0pW5uwtVh4wNyksisA3bxLnNjQ3UoTeTOmpSDLD8KgHWhkLRAK-mLqFMoYTdr-bsS7sZE6VHclP25hBIgyDdAfmClzirZ7i8JvecYlMjmev_B4RQW_LoQfvxHLXXcUrGp9liBQhF3SotFxJg979EJMMChZTr70mDXWsZvy9l29ppBQlx9VVfHjlSs4StyDk2gMQpW-qAOlf1IdPtm8m8b3PYY2c91rmCRB-4ybnuC58OQbzGyoTX6fOawDirkM15zhuIbORrBuQR4B9nV7k58jjtVt8akjYBdrVdqbDDZNzutJXmyfTiuKSjCzmdQvyfbn9sMQQQ
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }

  return result;
});
