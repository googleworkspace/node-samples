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
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Performs a batch update on a spreadsheet.
 * Updates the spreadsheet title and finds and replaces a string.
 * @param {string} spreadsheetId The ID of the spreadsheet to update.
 * @param {string} title The new title for the spreadsheet.
 * @param {string} find The string to find.
 * @param {string} replacement The string to replace the found string with.
 * @return {Promise<object>} The response from the batch update.
 */
async function batchUpdate(spreadsheetId, title, find, replacement) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create a new Sheets API client.
  const service = google.sheets({version: 'v4', auth});

  // Create a list of requests to be executed in the batch update.
  const requests = [];

  // Request to change the spreadsheet's title.
  requests.push({
    updateSpreadsheetProperties: {
      properties: {
        title,
      },
      fields: 'title',
    },
  });

  // Request to find and replace text.
  requests.push({
    findReplace: {
      find,
      replacement,
      allSheets: true,
    },
  });

  // Add more requests here if needed.

  // Create the batch update request.
  const batchUpdateRequest = {requests};

  // Execute the batch update request.
  const response = await service.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: batchUpdateRequest,
  });

  // Get the response from the find and replace request and log the number of occurrences.
  const findReplaceResponse = response.data.replies[1].findReplace;
  console.log(`${findReplaceResponse.occurrencesChanged} replacements made.`);
  return response;
}
// [END sheets_batch_update]

export {batchUpdate};
