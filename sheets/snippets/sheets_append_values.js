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

// [START sheets_append_values]
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Appends values to a spreadsheet.
 * @param {string} spreadsheetId The ID of the spreadsheet to update.
 * @param {string} range The range of cells to append to.
 * @param {string} valueInputOption How the input data should be interpreted.
 * @param {(string[])[]} _values A 2D array of values to append.
 * @return {Promise<object>} The response from the append request.
 */
async function appendValues(spreadsheetId, range, valueInputOption, _values) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create a new Sheets API client.
  const service = google.sheets({version: 'v4', auth});

  // The values to append to the spreadsheet.
  let values = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  // [START_EXCLUDE silent]
  values = _values;
  // [END_EXCLUDE]

  // Create the request body.
  const resource = {
    values,
  };

  // Append the values to the spreadsheet.
  const result = await service.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption,
    resource,
  });

  // Log the number of appended cells.
  console.log(`${result.data.updates.updatedCells} cells appended.`);
  return result;
}
// [END sheets_append_values]

export {appendValues};
