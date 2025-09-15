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
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Embeds a Sheets chart into a presentation.
 * @param {string} presentationId The ID of the presentation.
 * @param {string} pageId The ID of the page to embed the chart on.
 * @param {string} spreadsheetId The ID of the spreadsheet containing the chart.
 * @param {string} sheetChartId The ID of the chart in the spreadsheet.
 * @return {Promise<object>} The response from the batch update.
 */
async function createSheetsChart(
  presentationId,
  pageId,
  spreadsheetId,
  sheetChartId,
) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  // Create a new Slides API client.
  const service = google.slides({version: 'v1', auth});

  // The size of the embedded chart, in English Metric Units (EMUs).
  const emu4M = {
    magnitude: 4000000,
    unit: 'EMU',
  };

  // The ID to use for the embedded chart.
  const presentationChartId = 'MyEmbeddedChart';

  // The request to create a new chart.
  const requests = [
    {
      createSheetsChart: {
        objectId: presentationChartId,
        spreadsheetId,
        chartId: sheetChartId,
        // Linking mode allows the chart to be updated if the source sheet changes.
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

  // Execute the batch update request to create the chart.
  const batchUpdateResponse = await service.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests,
    },
  });
  console.log(`Added a linked Sheets chart with ID: ${presentationChartId}`);
  return batchUpdateResponse.data;
}
// [END slides_create_sheets_chart]

export {createSheetsChart};
