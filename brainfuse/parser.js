#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

// Adult Learning Center preparation modules. Each is a distinct study area.
const ALC_MODULES = /^\/alc\/(ged|citizenship|testcenter|skillsbuilding|writinglab)\.asp$/i;

// Service front doors. These are counted, deliberately: for a help service,
// reaching the menu is the patron declaring a need, which is not true of a
// contents page on a content platform.
const ENTRY_PAGES = /^(\/index\.asp|\/alc\/?|\/alc\/home\.asp|\/highed\/helpnow\.asp|\/jobnow\/index\.asp)$/i;

// Curated lists of outside resources, no parent work of their own.
const JOB_RESOURCES = /^\/jsp\/jobnow\/(joblinks|interviewresources)\.jsp$/i;

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  // Every path below is anchored end to end, and that is load bearing rather
  // than tidiness. Brainfuse names its menu icons after the services they link
  // to, so /images/alc/GEDIcon.png, ResumeIcon.png, WritingLabIcon.png and
  // TestCenterIcon.png all contain a service name as a substring. A loose match
  // counts the artwork as usage. The same shape appears twice more: the string
  // "vet" occurs inside liveTutoring, and the VetNow logo lives at
  // /wp-content/uploads/2025/03/BF_vetnow-2.png.webp on the marketing site.
  //
  // Authentication is never counted, so /login/index.asp, /login/csl.asp and
  // /login/loginCheck.asp are absent by design, as is the session furniture:
  // /cdn-cgi/rum, /includes/maintainSession*.asp, /includes/xmenu.asp,
  // /jsp/user/inbox/counters and favicon.
  //
  // /brainshare/docs/ is excluded on purpose and must stay excluded. Those
  // filenames carry patron names, so matching the path would carry an
  // identifiable person into the index.

  // Live tutoring request. The subject arrives under two different parameter
  // names depending on which front end raised the request.
  // /students/gettutor.asp?subjectID=119&catID=180698&...
  // /students/gettutor.asp?catID=180696&...&lstSubjects=132&...
  if (/^\/students\/gettutor\.asp$/i.test(path)) {
    result.rtype = 'SESSION';
    result.mime  = 'HTML';
    if (param.subjectID) {
      result.unitid = param.subjectID;
    } else if (param.lstSubjects) {
      result.unitid = param.lstSubjects;
    }

  // Live tutoring, entered from the service menu rather than a subject picker.
  // /highEd/liveTutoring.asp  /alc/livetutoring.asp
  } else if (/^\/(highed\/livetutoring|alc\/livetutoring)\.asp$/i.test(path)) {
    result.rtype = 'SESSION';
    result.mime  = 'HTML';

  // Resume review workspace.
  // /brainshare/resume_lab.asp  /alc/resume.asp
  } else if (/^\/(brainshare\/resume_lab|alc\/resume)\.asp$/i.test(path)) {
    result.rtype = 'TOOL';
    result.mime  = 'HTML';

  // Preparation modules: high school equivalency, US citizenship, test centre,
  // skills building, writing lab.
  } else if (ALC_MODULES.test(path)) {
    result.rtype = 'EXERCISE';
    result.mime  = 'HTML';

  // FlashBulb objects. These carry the only stable content ids on the tutoring
  // side of the platform.
  // /flashcard-53906  /quiz-393476
  } else if ((match = /^\/(flashcard|quiz)-(\d+)$/i.exec(path)) !== null) {
    result.rtype  = 'EXERCISE';
    result.mime   = 'HTML';
    result.unitid = match[2];

  // FlashBulb search. An empty q is the search box loading, not a search
  // performed, so it deliberately falls through to no result.
  // /SearchResults.jsp?q=ASL
  } else if (/^\/searchresults\.jsp$/i.test(path)) {
    if (param.q) {
      result.rtype = 'SEARCH';
      result.mime  = 'HTML';
    }

  // SkillSurfer lesson material, served as either a page or a Word document.
  // The vocabulary has no DOC or DOCX, so the document form takes MISC.
  // /curriculum-upload/c/1125511953311.html
  // /curriculum-upload/c/1k46ywnl50dhc_15limdcnfdpay.docx
  } else if ((match = /^\/curriculum-upload\/c\/([^/]+)\.(html|docx)$/i.exec(path)) !== null) {
    result.rtype  = 'EXERCISE';
    result.mime   = match[2].toLowerCase() === 'docx' ? 'MISC' : 'HTML';
    result.unitid = match[1];

  // SkillSurfer video. The response is the mp4 itself rather than a page around
  // it, and the vocabulary has MP3 for audio but nothing for video, so MISC.
  // /jsp/curriculum/video.jsp?id=102008
  } else if (/^\/jsp\/curriculum\/video\.jsp$/i.test(path)) {
    result.rtype = 'VIDEO';
    result.mime  = 'MISC';
    if (param.id) {
      result.unitid = param.id;
    }

  // Study materials for one subject. The subject is readable rather than an
  // opaque id, and arrives percent encoded.
  // /jsp/alc/alcStudyMaterials.jsp?s=U.S.%20Citizenship
  } else if (/^\/jsp\/alc\/alcstudymaterials\.jsp$/i.test(path)) {
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    if (param.s) {
      result.unitid = decodeURIComponent(param.s);
    }

  // Curated job resource lists.
  } else if (JOB_RESOURCES.test(path)) {
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  // Service front doors: HelpNow, JobNow and the Adult Learning Center.
  //
  // unitid is deliberately not set, and the temptation here is real. The u=
  // parameter carries a product code, main.johnsonhn / main.johnsonjn, so it
  // looks like it identifies the service. It must not go in unitid: that field
  // is the COUNTER de-duplication key and identifies the resource consulted,
  // so a constant service label would make separate visits look like repeat
  // views of one item. The code is also not dependable. /alc/ carries the hn
  // token while being the Adult Learning Center, and some libraries send no
  // code at all, as in u=main.anaheim.ca.brainfuse.com.
  } else if (ENTRY_PAGES.test(path)) {
    result.rtype = 'TOC';
    result.mime  = 'HTML';
  }

  return result;
});
