'use strict';

const { Transform } = require('stream');
const { pipeline } = require('node:stream/promises');

const fs = require('fs-extra');
const path = require('path');
const parse = require('csv').parse;

const kbartReg = /_[0-9]{4}-[0-9]{2}-[0-9]{2}\.txt$/;

// KBart filenames end with the date: _XXXX-XX-XX.txt
const sortByDate = (a, b) => a.substring(a.length - 14) < b.substring(b.length - 14) ? -1 : 1;

/**
 * Creates a Transform stream that removes specified lines from the input.
 *
 * @param {Set<number>} linesToRemove - A set of line numbers to be removed from the input.
 * @return {Transform} A Transform stream that filters out the specified lines.
 */
function removeLines(linesToRemove) {
  let buffer = '';
  let lineNumber = 0;

  const getLines = (opts) => {
    const flush = opts?.flush ?? false;
    let lines = '';
    let linefeedIndex = buffer.indexOf('\n');

    while (linefeedIndex !== -1) {
      lineNumber += 1;

      const line = buffer.substring(0, linefeedIndex + 1);
      buffer = buffer.substring(linefeedIndex + 1);

      if (!linesToRemove.has(lineNumber)) {
        lines += line;
      }

      linefeedIndex = buffer.indexOf('\n');
    }

    if (flush && !linesToRemove.has(lineNumber + 1)) {
      lines += buffer;
    }

    return lines;
  };

  return new Transform({
    flush(callback) {
      callback(null, getLines({ flush: true }));
    },
    transform(chunk, _encoding, callback) {
      buffer += chunk.toString();
      callback(null, getLines());
    }
  });
}

/**
 * Browse the PKBs files of a platform and remove duplicates and lines without title_id.
 *
 * @param  {Object} options
 * @param {String} options.platform - a platform whose PKB should be cleaned
 * @param {String} options.dir - a specific directory to clean
 * @param {Boolean} options.rewrite - rewrite files without duplicates (defaults to true)
 * @param {Function} options.onMissingId - called when a row has no title_id
 * @param {Function} options.onDuplicate - called when a duplicated title_id is found
 * @param {Function} options.onFile - called when a file is processed
 * @param {Function} options.onError - called when an error occurs
 *
 * @return {Promise<void>}
 */
module.exports = async function (options) {
  options = options || {};

  const onMissingId = typeof options.onMissingId === 'function' ? options.onMissingId : () => {};
  const onDuplicate = typeof options.onDuplicate === 'function' ? options.onDuplicate : () => {};
  const onFile = typeof options.onFile === 'function' ? options.onFile : () => {};
  const onError = typeof options.onError === 'function' ? options.onError : () => {};

  let dir;
  if (options.platform) {
    dir = path.resolve(__dirname, '..', options.platform, 'pkb');
  } else if (options.dir) {
    dir = options.dir;
  }

  if (!dir) {
    throw new TypeError('no directory provided');
  }

  const filenames = await fs.readdir(dir);
  const files = filenames
    .filter((file) => kbartReg.test(file))
    .sort(sortByDate)
    .map((file) => ({
      name: file,
      fullPath: path.resolve(dir, file),
      identifiers: new Map(),
      linesToRemove: new Set(),
      totalRecords: 0
    }));

  async function rewriteFiles() {
    for (const file of files) {
      const tmpFile = path.resolve(`${file.fullPath}.tmp`);
      const linesToRemove = file.linesToRemove;

      if (linesToRemove.size === 0) {
        continue;
      }

      if (linesToRemove.size === file.totalRecords) {
        try {
          await fs.unlink(file.fullPath);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            onError(err);
          }
        }
        continue;
      }

      try {
        await pipeline(
          fs.createReadStream(file.fullPath),
          removeLines(linesToRemove),
          fs.createWriteStream(tmpFile),
        );

        await fs.rename(tmpFile, file.fullPath);
      } catch (err) {
        onError(err);
      }
    }
  }

  async function readFiles() {
    for (const file of files) {
      let recordNumber = 0;

      onFile(file);

      /** @type {import('csv').parser.Options} */
      const parseOptions = {
        relaxColumnCount: true,
        relaxQuotes: true,
        skipEmptyLines: false,
        columns: true,
        delimiter: '\t'
      };

      const parser = fs.createReadStream(file.fullPath).pipe(parse(parseOptions));

      for await (const record of parser) {
        recordNumber += 1;

        const titleId = record.title_id;

        if (!titleId) {
          onMissingId(file, recordNumber);
          file.linesToRemove.add(recordNumber + 1);
          continue;
        }

        files.forEach((f) => {
          if (f.identifiers.has(titleId)) {
            onDuplicate(file, titleId, f.identifiers.get(titleId));
            f.linesToRemove.add(f.identifiers.get(titleId) + 1);
            f.identifiers.delete(titleId);
          }
        });

        file.identifiers.set(titleId, recordNumber);
      }

      file.totalRecords = recordNumber;
    }
  }

  await readFiles();

  if (options.rewrite) {
    await rewriteFiles();
  }
};

