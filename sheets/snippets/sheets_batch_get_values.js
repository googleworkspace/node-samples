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

// [START sheets_batch_get_values]
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth(
  {scopes: 'https://www.googleapis.com/auth/spreadsheet'});

/**
 * Batch gets cell values from a Spreadsheet.
 * @param {GoogleAuth} auth The google default authentication
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} _ranges The mock sheet range.
 */
function batchGetValues(auth, spreadsheetId, _ranges) {
  const service = google.sheets({version: 'v4', auth});
  let ranges = [
    // Range names ...
  ];
  // [START_EXCLUDE silent]
  ranges = _ranges;
  // [END_EXCLUDE]
  service.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
  }, (err, result) => {
    if (err) {
      // TODO (developer) - Handle exception
      console.error('The API returned an error:' + err);
    } else {
      console.log(`${result.data.valueRanges.length} ranges retrieved.`);
    }
  });
}
// [END sheets_batch_get_values]

// Replace the values below with desired values
batchGetValues(auth, '1SP6jdMywK6GhzKGHWOgAAZoJkGH2bdBKzOWT2GiacXA', 'A1:B2');
