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

const {expect} = require('expect');
const Helpers = require('./helpers');
const SheetsUpdateValues = require('../sheets_update_values');

describe('Spreadsheet update values snippet', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  it('should update spreadsheet values', async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    const result = await SheetsUpdateValues.updateValues(
        spreadsheetId,
        'A1:B2',
        'USER_ENTERED',
        [
          ['A', 'B'],
          ['C', 'D'],
        ],
    );
    expect(result.data.updatedRows).toBe(2);
    expect(result.data.updatedColumns).toBe(2);
    expect(result.data.updatedCells).toBe(4);
  });
});
