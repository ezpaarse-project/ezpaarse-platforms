#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

'use strict';

var PkbKbp = require('../../.lib/parsXmlKb+.js');

PkbKbp.generatePkbKbp(342, 'jstor');
