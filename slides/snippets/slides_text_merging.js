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

// [START slides_text_merging]
/**
 * Adds data from a spreadsheet to a template presentation.
 * @param {string} templatePresentationId The template presentation ID.
 * @param {string} dataSpreadsheetId  The data spreadsheet ID.
 */
async function textMerging(templatePresentationId, dataSpreadsheetId) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/presentations',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const slidesService = google.slides({version: 'v1', auth});
  const sheetsService = google.sheets({version: 'v4', auth});
  const driveService = google.drive({version: 'v2', auth});

  // Use the Sheets API to load data, one record per row.
  const responses = [];
  const dataRangeNotation = 'A2:M6';

  try {
    const sheetsResponse = await sheetsService.spreadsheets.values.get({
      spreadsheetId: dataSpreadsheetId,
      range: dataRangeNotation,
    });
    const values = sheetsResponse.data.values;

    // For each record, create a new merged presentation.
    for (let i = 0; i < values.length; ++i) {
      const row = values[i];
      const customerName = row[2]; // name in column 3
      const caseDescription = row[5]; // case description in column 6
      const totalPortfolio = row[11]; // total portfolio in column 12

      // Duplicate the template presentation using the Drive API.
      const copyTitle = customerName + ' presentation';
      let requests = {
        name: copyTitle,
      };

      const driveResponse = await driveService.files.copy({
        fileId: templatePresentationId,
        requests,
      });

      const presentationCopyId = driveResponse.data.id;
      // Create the text merge (replaceAllText) requests for this presentation.
      requests = [
        {
          replaceAllText: {
            containsText: {
              text: '{{customer-name}}',
              matchCase: true,
            },
            replaceText: customerName,
          },
        },
        {
          replaceAllText: {
            containsText: {
              text: '{{case-description}}',
              matchCase: true,
            },
            replaceText: caseDescription,
          },
        },
        {
          replaceAllText: {
            containsText: {
              text: '{{total-portfolio}}',
              matchCase: true,
            },
            replaceText: totalPortfolio,
          },
        },
      ];
      // Execute the requests for this presentation.
      const batchUpdateResponse = await slidesService.presentations.batchUpdate(
          {
            presentationId: presentationCopyId,
            resource: {
              requests,
            },
          },
      );
      const result = batchUpdateResponse.data;
      // [START_EXCLUDE silent]
      responses.push(result.replies);
      // [END_EXCLUDE]
      // Count the total number of replacements made.
      let numReplacements = 0;
      for (let i = 0; i < result.replies.length; ++i) {
        numReplacements += result.replies[i].replaceAllText.occurrencesChanged;
      }
      console.log(
          `Created presentation for ${customerName} with ID: ` +
          presentationCopyId,
      );
      console.log(`Replaced ${numReplacements} text instances`);
      return result;
    }
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// [END slides_text_merging]

module.exports = {textMerging};
