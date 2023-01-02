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

// [START slides_create_sheets_chart]
/**
 * Embeds a Sheets chart onto a page in a presentation.
 * @param {string} presentationId The presentation ID.
 * @param {string} pageId The page ID.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} sheetChartId The sheet's chart ID.
 */
async function createSheetsChart(
    presentationId,
    pageId,
    spreadsheetId,
    sheetChartId,
) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  const service = google.slides({version: 'v1', auth});

  // Embed a Sheets chart (indicated by the spreadsheetId and sheetChartId) onto
  // a page in the presentation. Setting the linking mode as "LINKED" allows the
  // chart to be refreshed if the Sheets version is updated.
  const emu4M = {
    magnitude: 4000000,
    unit: 'EMU',
  };
  const presentationChartId = 'MyEmbeddedChart';
  const requests = [
    {
      createSheetsChart: {
        objectId: presentationChartId,
        spreadsheetId: spreadsheetId,
        chartId: sheetChartId,
        linkingMode: 'LINKED',
        elementProperties: {
          pageObjectId: pageId,
          size: {
            height: emu4M,
            width: emu4M,
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 100000,
            translateY: 100000,
            unit: 'EMU',
          },
        },
      },
    },
  ];

  // Execute the request.
  try {
    const batchUpdateResponse = await service.presentations.batchUpdate({
      presentationId,
      resource: {
        requests,
      },
    });
    console.log(`Added a linked Sheets chart with ID: ${presentationChartId}`);
    return batchUpdateResponse.data;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// [END slides_create_sheets_chart]

module.exports = {createSheetsChart};
