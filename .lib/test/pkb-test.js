/*global describe, it, before, after*/
'use strict';

const assert = require('assert');
const fs = require('fs/promises');
const path = require('path');
const pkbClean = require('../pkb-cleaner.js');

describe('The PKB cleaner', function () {
  const pkbDir  = path.resolve(__dirname, 'pkb');
  const oldPkb  = path.resolve(pkbDir, 'pkb_2024-03-11.txt');
  const oldPkb2 = path.resolve(pkbDir, 'pkb_2024-05-11.txt');
  const oldPkb3 = path.resolve(pkbDir, 'pkb_2024-06-11.txt');
  const newPkb  = path.resolve(pkbDir, 'pkb_2024-09-17.txt');

  before(async function () {
    await fs.mkdir(pkbDir, { recursive: true});
    await fs.writeFile(oldPkb, 'title_id\n1\n2\n3\n4\n5\n');
    await fs.writeFile(oldPkb2, 'title_id\n3\n4\n6\n3\n');
    await fs.writeFile(oldPkb3, 'title_id\n4\n6\n');
    await fs.writeFile(newPkb, 'title_id\n3\n4\n5\n6\n7\n');
  });

  after(async function () {
    await fs.rm(pkbDir, { recursive: true, force: true });
  });

  it('correctly remove duplicates', async function () {

    await pkbClean({ dir: pkbDir, rewrite: true });

    const oldContent = (await fs.readFile(oldPkb, 'utf8')).trim().split('\n');
    const newContent = (await fs.readFile(newPkb, 'utf8')).trim().split('\n');

    assert.deepStrictEqual(oldContent, ['title_id', '1', '2']);
    assert.deepStrictEqual(newContent, ['title_id', '3', '4', '5', '6', '7']);

    await assert.rejects(fs.stat(oldPkb2), { code: 'ENOENT' });
    await assert.rejects(fs.stat(oldPkb3), { code: 'ENOENT' });
  });
});
