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

// [START sheets_conditional_formatting]
/**
 * Conditionally formats a Spreadsheet.
 * @param {string} spreadsheetId A Spreadsheet ID.
 * @return {obj} spreadsheet information
 */
async function conditionalFormatting(spreadsheetId) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({version: 'v4', auth});
  const myRange = {
    sheetId: 0,
    startRowIndex: 1,
    endRowIndex: 11,
    startColumnIndex: 0,
    endColumnIndex: 4,
  };
  const requests = [
    {
      addConditionalFormatRule: {
        rule: {
          ranges: [myRange],
          booleanRule: {
            condition: {
              type: 'CUSTOM_FORMULA',
              values: [{userEnteredValue: '=GT($D2,median($D$2:$D$11))'}],
            },
            format: {
              textFormat: {foregroundColor: {red: 0.8}},
            },
          },
        },
        index: 0,
      },
    },
    {
      addConditionalFormatRule: {
        rule: {
          ranges: [myRange],
          booleanRule: {
            condition: {
              type: 'CUSTOM_FORMULA',
              values: [{userEnteredValue: '=LT($D2,median($D$2:$D$11))'}],
            },
            format: {
              backgroundColor: {red: 1, green: 0.4, blue: 0.4},
            },
          },
        },
        index: 0,
      },
    },
  ];
  const resource = {
    requests,
  };
  try {
    const response = await service.spreadsheets.batchUpdate({
      spreadsheetId,
      resource,
    });
    console.log(`${response.data.replies.length} cells updated.`);
    return response;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// [END sheets_conditional_formatting]

module.exports = {conditionalFormatting};
