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

// [START sheets_get_values]
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth(
  {scopes: 'https://www.googleapis.com/auth/spreadsheet'});

/**
 * Gets cell values from a Spreadsheet.
 * @param {GoogleAuth} auth The google default authentiaction
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The sheet range.
 */
function getValues(auth, spreadsheetId, range) {
  const service = google.sheets({version: 'v4', auth});
  service.spreadsheets.values.get({
    spreadsheetId,
    range,
  }, (err, result) => {
    if (err) {
      // TODO (developer) - Handle exception
      console.log('The API returned an error: ' + err);
    } else {
      const numRows = result.data.values ? result.data.values.length : 0;
      console.log(`${numRows} rows retrieved.`);
      return result.values;
    }
  });
}
// [END sheets_get_values]

// Replace the values below with desired values
getValues(auth, '1SP6jdMywK6GhzKGHWOgAAZoJkGH2bdBKzOWT2GiacXA', 'A1:B2');
