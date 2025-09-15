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
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Gets cell values from a spreadsheet.
 * @param {string} spreadsheetId The ID of the spreadsheet.
 * @param {string} range The range of cells to retrieve.
 * @return {Promise<object>} The response from the get request.
 */
async function getValues(spreadsheetId, range) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create a new Sheets API client.
  const service = google.sheets({version: 'v4', auth});
  // Get the values from the specified range.
  const result = await service.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const numRows = result.data.values ? result.data.values.length : 0;
  console.log(`${numRows} rows retrieved.`);
  return result;
}
// [END sheets_get_values]

export {getValues};
