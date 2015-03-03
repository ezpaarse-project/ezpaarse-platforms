#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

// 
/*jslint maxlen: 180*/

'use strict';

var PkbRows     = require('../../.lib/pkbrows.js');

// pkb directory destination
var pkb         = new PkbRows('edp');

// Science Direct Master list have a kbplus pkg number of 947
var KBPlusPkg = 947;

// setKbartName() is required to fix the kbart output file name
pkb.consortiumName = 'KB+edp' + KBPlusPkg;       // default empty
pkb.packageName = 'Journals'; // default AllTitles
pkb.setKbartName();

pkb.getKbartFromKBPlus(KBPlusPkg);
