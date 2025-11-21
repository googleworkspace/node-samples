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
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Batch gets cell values from a spreadsheet.
 * @param {string} spreadsheetId The ID of the spreadsheet.
 * @param {string} _ranges The ranges of cells to retrieve.
 * @return {obj} The spreadsheet information.
 */
async function batchGetValues(spreadsheetId, _ranges) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create a new Sheets API client.
  const service = google.sheets({version: 'v4', auth});

  // The ranges to retrieve from the spreadsheet.
  let ranges = [
    // e.g., 'Sheet1!A1:C5',
    // 'Sheet2!A1:B3'
  ];
  // [START_EXCLUDE]
  ranges = _ranges;
  // [END_EXCLUDE]
  // Get the values from the specified ranges.
  const result = await service.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
  });
  console.log(`${result.data.valueRanges.length} ranges retrieved.`);
  return result;
}
// [END sheets_batch_get_values]

export {batchGetValues};
