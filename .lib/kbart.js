/**
 * Utility for generating KBart files
 */
'use strict';

const fs     = require('fs');
const path   = require('path');
const moment = require('moment');

const idChecker   = require('./id-checker');
const kbartFields = require('./kbart-fields');

class KBart {
  constructor (options) {
    this.directory  = options.directory;
    this.provider   = options.provider;
    this.consortium = options.consortium;
    this.package    = options.package || 'AllTitles';
    this.date       = options.date || new Date();
    this.rows       = new Map();
    this.columns    = new Set(kbartFields);

    this.nb = {
      duplicates: 0,
      noTitleId: 0,
      empty: 0,
      invalid: 0
    };
  }

  /**
   * Add an entry to the list
   * @param {Object} entry
   */
  add (entry) {
    if (typeof entry !== 'object') {
      return this.nb.invalid++;
    }
    if (!entry.title_id) { return this.nb.noTitleId++; }

    const props = Object.keys(entry);

    props.forEach(prop => {
      entry[prop] = entry[prop].toString().trim();
      if (!this.columns.has(prop)) { this.columns.add(prop); }
    });

    const empty = !props.some(prop => prop !== 'title_id' && entry[prop]);
    if (empty) { return this.nb.empty++; }

    for (const idField of ['print_identifier', 'online_identifier']) {
      if (/^n\/a|unknown|en *cours$/i.test(entry[idField])) {
        entry[idField] = '';
      } else if (entry[idField] && !idChecker.isValidIdentifier(entry[idField])) {
        // Add a sharp to invalid identifiers
        entry[idField] = `#${entry[idField]}`;
      }
    }

    if (this.rows.has(entry.title_id)) {
      this.nb.duplicates++;
    }

    this.rows.set(entry.title_id, entry);
    return this;
  }

  getFileName () {
    const date     = moment(this.date).format('YYYY-MM-DD');
    const provider = this.consortium ? `${this.provider}_${this.consortium}`: this.provider;
    const pkg      = this.package;

    return `${provider}_${pkg}_${date}.txt`;
  }

  /**
   * Save the KBart file into a directory
   * @param {String} dest destination directory
   */
  save () {
    return new Promise((resolve, reject) => {

      const file    = path.resolve(this.directory, this.getFileName());
      const rows    = this.rows.values();
      const columns = Array.from(this.columns);
      const writer  = fs.createWriteStream(file);

      writer.on('error', reject);
      writer.on('finish', () => { resolve(file, this.rows.size); });

      writer.write(columns.join('\t'));
      writer.write('\n');

      writeNextEntry();

      function writeNextEntry() {
        const { value: row, done } = rows.next();
        if (!row) { return done ? writer.end() : process.nextTick(writeNextEntry); }

        const line = columns.map(f => {
          const value = row[f] || '';
          return /[\t"]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        }).join('\t');

        if (writer.write(`${line}\n`)) {
          process.nextTick(writeNextEntry);
        } else {
          writer.once('drain', writeNextEntry);
        }
      }
    });
  }

  /**
   * Print a summary
   */
  summarize () {
    console.log(`${this.rows.size} entries saved into ${this.getFileName()}`);

    if (this.nb.duplicates) {
      console.log(`Duplicates: ${this.nb.duplicates}`);
    }
    if (this.nb.noTitleId) {
      console.log(`No title_id: ${this.nb.noTitleId}`);
    }
    if (this.nb.empty) {
      console.log(`Empty lines: ${this.nb.empty}`);
    }
    if (this.nb.invalid) {
      console.log(`Invalid entries: ${this.nb.invalid}`);
    }
  }
}

module.exports = KBart;
