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
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth(
  {scopes: 'https://www.googleapis.com/auth/spreadsheet'});

/**
 * Batch Updates values in a Spreadsheet.
 * @param {GoogleAuth} auth The google default authentication
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The range of values to update.
 * @param {object} valueInputOption Value update options.
 * @param {(string[])[]} _values A 2d array of values to update.
 */
function batchUpdateValues(auth, spreadsheetId, range, valueInputOption, _values) {
  const service = google.sheets({version: 'v4', auth});
  let values = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  // [START_EXCLUDE silent]
  values = _values;
  // [END_EXCLUDE]
  const data = [{
    range,
    values,
  }];
  // Additional ranges to update ...
  const resource = {
    data,
    valueInputOption,
  };
  service.spreadsheets.values.batchUpdate({
    spreadsheetId,
    resource,
  }, (err, result) => {
    if (err) {
      // TODO (developer) - Handle exception
      console.log('The API returned an error: ' + err);
    } else {
      console.log('%d cells updated.', result.data.totalUpdatedCells);
    }
  });
}
// [END sheets_batch_update_values]

// Replace the values below with desired values
batchUpdateValues(auth, '1SP6jdMywK6GhzKGHWOgAAZoJkGH2bdBKzOWT2GiacXA', 'A1:B2', 'USER_ENTERED', [
  ['A', 'B'],
  ['C', 'D'],
]);
