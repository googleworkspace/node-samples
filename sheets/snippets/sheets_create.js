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

// [START sheets_create]
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Creates a new Google Spreadsheet.
 * @param {string} title The title of the new spreadsheet.
 * @return {string} The ID of the created spreadsheet.
 */
async function create(title) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create a new Sheets API client.
  const service = google.sheets({version: 'v4', auth});

  // The resource body for creating a new spreadsheet.
  const resource = {
    properties: {
      title,
    },
  };

  // Create the new spreadsheet.
  const spreadsheet = await service.spreadsheets.create({
    resource,
    fields: 'spreadsheetId',
  });

  // Log the ID of the new spreadsheet.
  console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
  return spreadsheet.data.spreadsheetId;
}
// [END sheets_create]

export {create};
