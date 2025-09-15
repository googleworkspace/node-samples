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
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Creates a pivot table in a spreadsheet.
 * @param {string} spreadsheetId The ID of the spreadsheet.
 * @return {Promise<object>} The response from the batch update.
 */
async function pivotTable(spreadsheetId) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({version: 'v4', auth});

  // Create two new sheets for the pivot table.
  // One for the source data and one for the pivot table itself.
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

  // Get the IDs of the newly created sheets.
  const sourceSheetId = response.data.replies[0].addSheet.properties.sheetId;
  const targetSheetId = response.data.replies[1].addSheet.properties.sheetId;

  // Add a pivot table to the new sheet.
  requests = [
    {
      updateCells: {
        rows: {
          values: [
            {
              pivotTable: {
                // The source data for the pivot table.
                source: {
                  sheetId: sourceSheetId,
                  startRowIndex: 0,
                  startColumnIndex: 0,
                  endRowIndex: 20,
                  endColumnIndex: 7,
                },
                // The rows of the pivot table.
                rows: [
                  {
                    sourceColumnOffset: 1,
                    showTotals: true,
                    sortOrder: 'ASCENDING',
                  },
                ],
                // The columns of the pivot table.
                columns: [
                  {
                    sourceColumnOffset: 4,
                    sortOrder: 'ASCENDING',
                    showTotals: true,
                  },
                ],
                // The values to display in the pivot table.
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
        // The location to place the pivot table.
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

  // Send the batch update request to create the pivot table.
  response = service.spreadsheets.batchUpdate({
    spreadsheetId,
    resource,
  });
  return response;
}
// [END sheets_pivot_tables]

export {pivotTable};
