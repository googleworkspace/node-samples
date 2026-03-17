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

// [START sheets_batch_update_values]
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Batch updates values in a spreadsheet.
 * @param {string} spreadsheetId The ID of the spreadsheet to update.
 * @param {string} range The range of cells to update.
 * @param {string} valueInputOption How the input data should be interpreted.
 * @param {(string[])[]} _values A 2D array of values to update.
 * @return {Promise<object>} The response from the batch update.
 */
async function batchUpdateValues(
  spreadsheetId,
  range,
  valueInputOption,
  _values,
) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create a new Sheets API client.
  const service = google.sheets({version: 'v4', auth});

  // The values to update in the spreadsheet.
  let values = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  // [START_EXCLUDE silent]
  values = _values;
  // [END_EXCLUDE]

  // The data to be updated.
  const data = [
    {
      range,
      values,
    },
  ];

  // Additional ranges to update can be added here.

  // Create the batch update request.
  const resource = {
    data,
    valueInputOption,
  };

  // Execute the batch update request.
  const result = await service.spreadsheets.values.batchUpdate({
    spreadsheetId,
    resource,
  });

  // Log the number of updated cells.
  console.log('%d cells updated.', result.data.totalUpdatedCells);
  return result;
}
// [END sheets_batch_update_values]

export {batchUpdateValues};
