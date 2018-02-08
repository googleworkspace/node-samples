/**
 * @license
 * Copyright Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Promise = require('promise');
const expect = require('expect');
const Helpers = require('./helpers');
const SheetsSnippets = require('../snippets');

const mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(done, (err) => {
      done(err);
    });
  };
};

describe('Spreadsheet snippets', () => {
  const helpers = new Helpers();
  let snippets;

  before((done) => {
    Promise.all([
      helpers.driveService,
      helpers.sheetsService,
    ]).then((services) => {
      snippets = new SheetsSnippets(services);
      done();
    }).catch(done);
  });

  beforeEach(() => {
    helpers.reset();
  });

  afterEach(() => {
    return helpers.cleanup();
  });

  it('should create a spreadsheet', mochaAsync(async () => {
    const id = await snippets.create('Title');
    expect(id).toExist();
    helpers.deleteFileOnCleanup(id);
  }));

  it('should batch update a spreadsheet', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await snippets.batchUpdate(spreadsheetId, 'New Title', 'Hello', 'Goodbye');
    const replies = result.replies;
    expect(replies.length).toBe(2);
    const findReplaceResponse = replies[1].findReplace;
    expect(findReplaceResponse.occurrencesChanged).toBe(100);
  }));

  it('should get spreadsheet values', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await snippets.getValues(spreadsheetId, 'A1:C2');
    const values = result.values;
    expect(values.length).toBe(2);
    expect(values[0].length).toBe(3);
  }));

  it('should batch get spreadsheet values', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await snippets.batchGetValues(spreadsheetId, ['A1:A3', 'B1:C1']);
    const valueRanges = result.valueRanges;
    expect(valueRanges.length).toBe(2);
    const values = valueRanges[0].values;
    expect(values.length).toBe(3);
  }));

  it('should update spreadsheet values', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    const result = await snippets.updateValues(spreadsheetId, 'A1:B2', 'USER_ENTERED', [
      ['A', 'B'],
      ['C', 'D'],
    ]);
    expect(result.updatedRows).toBe(2);
    expect(result.updatedColumns).toBe(2);
    expect(result.updatedCells).toBe(4);
  }));

  it('should batch update spreadsheet values', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    const result = await snippets.batchUpdateValues(spreadsheetId, 'A1:B2', 'USER_ENTERED', [
      ['A', 'B'],
      ['C', 'D'],
    ]);
    const responses = result.responses;
    expect(responses.length).toBe(1);
    expect(result.totalUpdatedRows).toBe(2);
    expect(result.totalUpdatedColumns).toBe(2);
    expect(result.totalUpdatedCells).toBe(4);
  }));

  it('should append values to a spreadsheet', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await snippets.appendValues(spreadsheetId, 'Sheet1', 'USER_ENTERED', [
      ['A', 'B'],
      ['C', 'D'],
    ]);
    expect(result.tableRange).toBe('Sheet1!A1:J10');
    let updates = result.updates;
    expect(updates.updatedRows).toBe(2);
    expect(updates.updatedColumns).toBe(2);
    expect(updates.updatedCells).toBe(4);
  }));

  it('should create pivot tables', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await snippets.pivotTable(spreadsheetId);
    expect(result).toExist();
  }));

  it('should conditionally format', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await snippets.conditionalFormatting(spreadsheetId);
    expect(result.replies.length).toBe(2);
  }));
});
