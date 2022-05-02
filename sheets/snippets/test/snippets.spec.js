/**
 * Copyright 2022 Google LLC
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
const SheetsCreate = require('../sheets_create');
const SheetsBatchUpdate = require('../sheets_batch_update');
const SheetsGetValues = require('../sheets_get_values');
const SheetsBatchGetValues = require('../sheets_batch_get_values');
const SheetsUpdateValues = require('../sheets_update_values');
const SheetsBatchUpdateValues = require('../sheets_batch_update_values');
const SheetsAppendValues = require('../sheets_append_values');
const SheetsPivotTable = require('../sheets_pivot_table');
const SheetsConditionalFormatting = require('../sheets_conditional_formatting');

const mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(done, (err) => {
      done(err);
    });
  };
};

describe('Spreadsheet snippets', () => {
  const helpers = new Helpers();

  before((done) => {
    Promise.all([
      helpers.driveService,
      helpers.sheetsService,
    ]).then((services) => {
      done();
    }).catch(done);
  });

  beforeEach(() => {
    helpers.reset();
  });

  afterEach(() => {
    helpers.cleanup();
  });

  after(() => {
    return new Promise((resolve) => setTimeout(resolve, 10));
  });

  it('should create a spreadsheet', mochaAsync(async () => {
    const id = await SheetsCreate.create('Title');
    expect(id).toExist();
    helpers.deleteFileOnCleanup(id);
  }));

  it('should batch update a spreadsheet', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await SheetsBatchUpdate.batchUpdate(spreadsheetId,
        'New Title', 'Hello', 'Goodbye');
    const replies = result.data.replies;
    expect(replies.length).toBe(2);
    const findReplaceResponse = replies[1].findReplace;
    expect(findReplaceResponse.occurrencesChanged).toBe(100);
  }));

  it('should get spreadsheet values', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await SheetsGetValues.getValues(spreadsheetId, 'A1:C2');
    const values = result.data.values;
    expect(values.length).toBe(2);
    expect(values[0].length).toBe(3);
  }));

  it('should batch get spreadsheet values', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await SheetsBatchGetValues.batchGetValues(spreadsheetId, ['A1:A3', 'B1:C1']);
    const valueRanges = result.data.valueRanges;
    expect(valueRanges.length).toBe(2);
    const values = valueRanges[0].values;
    expect(values.length).toBe(3);
  }));

  it('should update spreadsheet values', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    const result = await SheetsUpdateValues.updateValues(spreadsheetId, 'A1:B2', 'USER_ENTERED', [
      ['A', 'B'],
      ['C', 'D'],
    ]);
    expect(result.data.updatedRows).toBe(2);
    expect(result.data.updatedColumns).toBe(2);
    expect(result.data.updatedCells).toBe(4);
  }));

  it('should batch update spreadsheet values', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    const result = await SheetsBatchUpdateValues.batchUpdateValues(spreadsheetId,
        'A1:B2', 'USER_ENTERED', [
          ['A', 'B'],
          ['C', 'D'],
        ]);
    const responses = result.data.responses;
    expect(responses.length).toBe(1);
    expect(result.data.totalUpdatedRows).toBe(2);
    expect(result.data.totalUpdatedColumns).toBe(2);
    expect(result.data.totalUpdatedCells).toBe(4);
  }));

  it('should append values to a spreadsheet', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await SheetsAppendValues.appendValues(spreadsheetId, 'Sheet1', 'USER_ENTERED', [
      ['A', 'B'],
      ['C', 'D'],
    ]);
    expect(result.data.tableRange).toBe('Sheet1!A1:J10');
    const updates = result.data.updates;
    expect(updates.updatedRows).toBe(2);
    expect(updates.updatedColumns).toBe(2);
    expect(updates.updatedCells).toBe(4);
  }));

  it('should create pivot tables', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await SheetsPivotTable.pivotTable(spreadsheetId);
    expect(result).toExist();
  }));

  it('should conditionally format', mochaAsync(async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await SheetsConditionalFormatting.conditionalFormatting(spreadsheetId);
    expect(result.data.replies.length).toBe(2);
  }));
});
