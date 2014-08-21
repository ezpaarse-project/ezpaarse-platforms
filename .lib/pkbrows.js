/**
 * PKB row object
 * used to manage how PKB rows must be
 * deduplicate, sorted and written to CSV format
 */

'use strict';

var EventEmitter  = require('events').EventEmitter;
var moment        = require('moment');
var fs            = require('graceful-fs');
var path          = require('path');

// Constructeur
var PkbRows = function(providerName) {
  var self = this;

  self.rowsMap   = {};
  self.rows      = [];
  self.sorted    = true;
  self.providerName = providerName ? providerName : '';         // provider name will be filled with platform name from path
  self.consortiumName = '';       // default empty
  self.packageName = 'AllTitles'; // default AllTitles
  self.kbartFileName = '';

  var optimist = require('optimist')
    .boolean(['f', 'v'])
    .alias('force', 'f')
    .describe('force',
              'If provided, force overwriting of kbart output.')
    .alias('verbose', 'v')
    .describe('verbose',
              'show detailed actions.');
  self.argv = optimist.argv;

  var match;
  if ( !self.providerName.length) {
    // search platform name in path
    if ((match = /\/([a-z]+[0-9]?)$/.exec(path.dirname(self.argv.$0))) !== null) {
      self.providerName = match[1];
    } else {
      console.log(__filename, self.argv.$0);
      self.providerName = 'default_platform';
      if (self.argv.verbose) { console.error("Warning : using platform name " + self.providerName); }
    }
  }

  // prepare output directory name for kbart file
  if (self.providerName !== 'default_platform') {
    self.kbartFileName = path.normalize(path.dirname(__filename) + '/../../platforms/'
    + self.providerName + '/pkb/');
  } else {
    self.kbartFileName = './';
  }

  optimist.usage('Scrape platforms catalog for ' +
      self.providerName + ' from URLs ' +
      '\n  Usage: $0\n Kbart output directory :' + self.kbartFileName);

  // show usage if --help option is used
  if (self.argv.help || self.argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

};

// Hérite d'un eventemitter
PkbRows.prototype = Object.create(EventEmitter.prototype);

PkbRows.prototype.setKbartName = function () {
  var self = this;
  // Knowledge Bases and Related
  // Tools (KBART)
  // Recommended Practice
  // DRAFT For Public Comment September 4 – October 4, 2013
  // File Name
  // [ProviderName]_[Region/Consortium]_[PackageName]_[YYYY-MM-DD].txt

  if (self.providerName) { self.kbartFileName += self.providerName; }
  if (self.consortiumName) { self.kbartFileName += '_' + self.consortiumName; }
  if (self.packageName) { self.kbartFileName += '_' + self.packageName; }
  self.kbartFileName += '_' + moment().format('YYYY-MM-DD') + '.txt';

  if (self.argv.verbose) { console.error("Output kbart file : " + self.kbartFileName); }
  if (self.argv.verbose && fs.existsSync(self.kbartFileName) && self.argv.force) {
    if (self.argv.force) { console.error("Overwriting ..."); }
  }
  if ((fs.existsSync(self.kbartFileName) && self.argv.force) || ! fs.existsSync(self.kbartFileName)) {
    self.dstStream = fs.openSync(self.kbartFileName, "w", function() {} )
  } else {
    console.error("File " + self.kbartFileName + " exists, skiping (use --force to overwrite)");
    process.exit(1);
  }
}

PkbRows.prototype.initRow = function (info) {
  // initialize a kbart record
  var kbart2Fields  = require('../../lib/outputformats/kbart.json');

  kbart2Fields.forEach(function (field) {
    if (!info.hasOwnProperty(field)) { info[field] = ''; }
  });
  return info;
}

PkbRows.prototype.addRow = function (row, deduplicateFn) {
  var self = this;
  var ridchecker  = require('../../lib/rid-syntax-checker.js');


  // cleanup ISSN/ISBN values
  if (row.print_identifier !== undefined) {
    if (row.print_identifier !== undefined) { row.print_identifier = row.print_identifier.trim().toUpperCase(); }
    // check ISSN/ISBN syntax and set it to blank if wrong
    if (row.print_identifier === 'N/A' || row.print_identifier === 'EN COURS' || row.print_identifier === 'UNKNOWN') {
      row.print_identifier = '';
    }
    // if ISSN is not valid remove controls
    if (row.print_identifier.length) {
      var validISSN = ridchecker.getISSN(row.print_identifier).isValid;
      var validISBN = ridchecker.getISBN(row.print_identifier).isValid;
      if (!validISSN && !validISBN) {
        row.print_identifier = '#' + row.print_identifier;
      }
    }
  }

  if (row.online_identifier !== undefined) {
    if (row.online_identifier !== undefined) { row.online_identifier = row.online_identifier.trim().toUpperCase(); }
    if (row.online_identifier === 'N/A' || row.online_identifier === 'EN COURS' || row.online_identifier === 'UNKNOWN') {
      row.online_identifier = '';
    }

    // if ISSN is not valid remove controls
    if (row.online_identifier.length) {
      var validISSN = ridchecker.getISSN(row.online_identifier).isValid;
      var validISBN = ridchecker.getISBN(row.online_identifier).isValid;
      if (!validISSN && !validISBN) {
        row.online_identifier = '#' + row.online_identifier;
      }
    }
  }


  // skip if no title_id
  if (row.title_id === undefined || row.title_id == '') {
    console.error('Skipping row because title_id is empty: ' + JSON.stringify(row));
    return;
  }

  // skip only if one of the field is not empty
  // expect the title_id field
  var skipBecauseEmpty = true;
  Object.keys(row).forEach(function (field) {
    if (field == 'title_id' || !skipBecauseEmpty) return;
    if (row[field].toString().trim() !== '') {
      skipBecauseEmpty = false;
    }
  });
  if (skipBecauseEmpty) {
    console.error('Skipping row because all the fields expect title_id are empty: ' + JSON.stringify(row));
    return;
  }

  // deduplicate the rows only if the "title_id" field is not unique
  if (!self.rowsMap[row.title_id]) {
    self.rowsMap[row.title_id] = row;
    self.sorted = false;
    console.error('Keeping row:  print_identifier = "' + row.print_identifier +
                  '"\t online_identifier = "' + row.online_identifier +
                  '"\t title_id = "' + row.title_id + '"');
    //console.error(JSON.stringify(row));
  } else {
    // need to choose which row must be caught ?
    if (deduplicateFn) {
      // call the algorithme who will choose the row to keep
      var rowKeept = deduplicateFn(self.rowsMap[row.title_id], row);
      if (rowKeept == self.rowsMap[row.title_id]) {
        console.error('Skipping this row because this "title_id" has a duplicate ' +
                      'and because of a scraper specific criteria: ' +
                      JSON.stringify(row) + ' but keeping this one ' +
                      JSON.stringify(rowKeept));
      } else {
        console.error('Skipping this row because this "title_id" has a duplicate ' +
                      'and because of a scraper specific criteria: ' +
                      JSON.stringify(self.rowsMap[row.title_id]) + ' but keeping this one ' +
                      JSON.stringify(rowKeept));
      }
      self.rowsMap[row.title_id] = rowKeept;
    } else {
      console.error('Skipping this row because this "title_id" has a duplicate: ' + JSON.stringify(row));
    }
    return;
  }

};

PkbRows.prototype.sortRows = function () {
  var self = this;

  if (self.sorted) return;

  // populate the rows list
  self.rows = [];
  Object.keys(self.rowsMap).forEach(function (field) {
    self.rows.push(self.rowsMap[field]);
  });
  // sort the rows list
  self.rows.sort(function compare(a, b) {
    var t1 = a['title_id'].toUpperCase();
    var t2 = b['title_id'].toUpperCase();

    if (t1 > t2)      { return 1;  }
    else if (t1 < t2) { return -1; }
    else              { return 0;  }
  });

  self.sorted = true;
};

PkbRows.prototype.writeCSV = function (dstStream) {
  var self = this;

  // start rows sorting
  self.sortRows();

  var firstLine = true;
  var fields    = [];
  function writeRowAsCSVToStream(row) {
    if (firstLine) {
      firstLine = false;
      fields = Object.keys(row);
      fields.forEach(function (field, idx) {
        dstStream.write(field + (idx < fields.length - 1 ? ';' : ''));
      });
      dstStream.write('\n');
    }
    fields.forEach(function (field, idx) {
      if (row[field] === undefined) row[field] = ''; // keep only strings
      if (/[;"]/.test(row[field])) {
        dstStream.write('"' + row[field].replace(/"/g, '""') + '"');
      } else {
        dstStream.write(row[field]);
      }
      dstStream.write(idx < fields.length - 1 ? ';' : '');
    });
    dstStream.write('\n');
  }

  // write rows to the stream
  self.rows.forEach(function (row) {
    writeRowAsCSVToStream(row);
  });
};

PkbRows.prototype.writeKbart = function (callback) {
  callback = callback || function () {};
  var self = this;

  // start rows sorting
  self.sortRows();

  var fields    = [];
  var dstStream = fs.createWriteStream(self.kbartFileName);

  if (self.rows.length === 0) { return callback(); }

  fields = Object.keys(self.rows[0]);
  fields.forEach(function (field, idx) {
    dstStream.write(field);
    if (idx < fields.length - 1) { dstStream.write('\t'); }
  });
  dstStream.write('\n');

  var i = 0;
  var writeRow = function (index) {
    var row = self.rows[index];
    if (!row) {
      dstStream.end(callback);
      return;
    }

    var line = '';
    fields.forEach(function (field, idx) {
      if (!row[field]) { row[field] = ''; } // keep only strings
      if (/[\t"]/.test(row[field])) {
        line += '"' + row[field].replace(/"/g, '""') + '"';
      } else {
        line += row[field];
      }
      if (idx < fields.length - 1) { line += '\t'; }
    });
    line += '\n';

    if (dstStream.write(line)) { writeRow(i++); }
  };

  dstStream.on('drain', function () {
    writeRow(i++);
  });

  writeRow(i++);
};

module.exports = PkbRows;
