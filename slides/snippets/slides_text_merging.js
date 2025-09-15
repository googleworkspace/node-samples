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
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Merges text from a spreadsheet into a template presentation.
 * @param {string} templatePresentationId The ID of the template presentation.
 * @param {string} dataSpreadsheetId The ID of the spreadsheet containing the data.
 */
async function textMerging(templatePresentationId, dataSpreadsheetId) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/presentations',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  // Create new clients for Slides, Sheets, and Drive APIs.
  const slidesService = google.slides({version: 'v1', auth});
  const sheetsService = google.sheets({version: 'v4', auth});
  const driveService = google.drive({version: 'v2', auth});

  // Use the Sheets API to load data from the spreadsheet.
  const dataRangeNotation = 'A2:M6';
  const sheetsResponse = await sheetsService.spreadsheets.values.get({
    spreadsheetId: dataSpreadsheetId,
    range: dataRangeNotation,
  });
  const values = sheetsResponse.data.values;

  // For each row of data, create a new presentation by copying the template
  // and replacing the placeholder text with the data.
  for (let i = 0; i < values.length; ++i) {
    const row = values[i];
    const customerName = row[2]; // Column 3
    const caseDescription = row[5]; // Column 6
    const totalPortfolio = row[11]; // Column 12

    // Duplicate the template presentation.
    const title = `${customerName} presentation`;
    const driveResponse = await driveService.files.copy({
      fileId: templatePresentationId,
      requestBody: {
        title,
      },
    });
    const presentationCopyId = driveResponse.data.id;

    // Create the text merge requests for this presentation.
    const requests = [
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

    // Execute the requests to replace the placeholder text.
    const batchUpdateResponse = await slidesService.presentations.batchUpdate({
      presentationId: presentationCopyId,
      requestBody: {
        requests,
      },
    });
    const result = batchUpdateResponse.data;

    // Count the total number of replacements made.
    let numReplacements = 0;
    for (let i = 0; i < result.replies.length; ++i) {
      numReplacements += result.replies[i].replaceAllText.occurrencesChanged;
    }
    console.log(
      `Created presentation for ${customerName} with ID: ${presentationCopyId}`,
    );
    console.log(`Replaced ${numReplacements} text instances.`);
  }
}
// [END slides_text_merging]

export {textMerging};
