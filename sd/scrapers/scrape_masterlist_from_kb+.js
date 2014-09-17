#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

// 
/*jslint maxlen: 180*/

'use strict';

var PkbRows     = require('../../.lib/pkbrows.js');

// pkb directory destination
var pkb         = new PkbRows('sd');

// Science Direct Master list have a kbplus pkg number of 512
var KBPlusPkg = 512;

// setKbartName() is required to fix the kbart output file name
pkb.consortiumName = 'KB+Masterlists' + KBPlusPkg;       // default empty
pkb.packageName = 'Journals'; // default AllTitles
pkb.setKbartName();

pkb.getKbartFromKBPlus(KBPlusPkg);
