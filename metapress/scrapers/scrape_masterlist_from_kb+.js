#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

// 
/*jslint maxlen: 180*/

'use strict';

// var URL         = require('url');

var PkbRows     = require('../../.lib/pkbrows.js');

// pkb directory destination
var pkb         = new PkbRows('metapress');

// Metapress have a kbplus pkg number of 99
var KBPlusPkg = 99;

// setKbartName() is required to fix the kbart output file name
pkb.consortiumName = 'KB+Masterlists' + KBPlusPkg;       // default empty
pkb.packageName = 'Journals'; // default AllTitles
pkb.setKbartName();

pkb.getKbartFromKBPlus(KBPlusPkg);
