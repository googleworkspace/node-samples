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

// [START sheets_pivot_tables]
/**
 * Adds a pivot table to a spreadsheet.
 * @param {string} spreadsheetId The Spreadsheet to add the pivot table to.
 * @return {obj} spreadsheet information
 */
async function pivotTable(spreadsheetId) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({version: 'v4', auth});
  try {
    // Create two sheets for our pivot table
    let requests = [
      {
        addSheet: {},
      },
      {
        addSheet: {},
      },
    ];
    let resource = {requests};
    let response = await service.spreadsheets.batchUpdate({
      spreadsheetId,
      resource,
    });
    const sourceSheetId = response.data.replies[0].addSheet.properties.sheetId;
    const targetSheetId = response.data.replies[1].addSheet.properties.sheetId;

    requests = [
      {
        updateCells: {
          rows: {
            values: [
              {
                pivotTable: {
                  source: {
                    sheetId: sourceSheetId,
                    startRowIndex: 0,
                    startColumnIndex: 0,
                    endRowIndex: 20,
                    endColumnIndex: 7,
                  },
                  rows: [
                    {
                      sourceColumnOffset: 1,
                      showTotals: true,
                      sortOrder: 'ASCENDING',
                    },
                  ],
                  columns: [
                    {
                      sourceColumnOffset: 4,
                      sortOrder: 'ASCENDING',
                      showTotals: true,
                    },
                  ],
                  values: [
                    {
                      summarizeFunction: 'COUNTA',
                      sourceColumnOffset: 4,
                    },
                  ],
                  valueLayout: 'HORIZONTAL',
                },
              },
            ],
          },
          start: {
            sheetId: targetSheetId,
            rowIndex: 0,
            columnIndex: 0,
          },
          fields: 'pivotTable',
        },
      },
    ];
    resource = {
      requests,
    };
    response = service.spreadsheets.batchUpdate({
      spreadsheetId,
      resource,
    });
    return response;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// [END sheets_pivot_tables]

module.exports = {pivotTable};
