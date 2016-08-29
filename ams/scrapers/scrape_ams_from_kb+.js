#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

'use strict';

var pkbKbp = require('../../.lib/parsXmlKb+.js');

pkbKbp.generatePkbKbp(1535, 'ams');
