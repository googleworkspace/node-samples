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

// [START sheets_batch_update]
/**
 * Updates the Spreadsheet title. Finds and replaces a string in the sheets.
 * @param {string} spreadsheetId The Spreadsheet to update
 * @param {string} title The new Spreadsheet title
 * @param {string} find The text to find
 * @param {string} replacement The text to replace
 * @return {obj} holding the information regarding the replacement of strings
 */
async function batchUpdate(spreadsheetId, title, find, replacement) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({version: 'v4', auth});
  const requests = [];
  // Change the spreadsheet's title.
  requests.push({
    updateSpreadsheetProperties: {
      properties: {
        title,
      },
      fields: 'title',
    },
  });
  // Find and replace text.
  requests.push({
    findReplace: {
      find,
      replacement,
      allSheets: true,
    },
  });
  // Add additional requests (operations) ...
  const batchUpdateRequest = {requests};
  try {
    const response = await service.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: batchUpdateRequest,
    });
    const findReplaceResponse = response.data.replies[1].findReplace;
    console.log(`${findReplaceResponse.occurrencesChanged} replacements made.`);
    return response;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// [END sheets_batch_update]

module.exports = {batchUpdate};
