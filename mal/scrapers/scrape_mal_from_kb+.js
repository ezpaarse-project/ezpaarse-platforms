#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

//
/*jslint maxlen: 180*/

'use strict';
var path = require('path');

var PkbKbp     =  require(path.join(__dirname, '../../.lib/parsXmlKb+.js'));

PkbKbp.generatePkbKbp(960,  'mal');
