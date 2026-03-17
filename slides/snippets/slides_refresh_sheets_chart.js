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

// [START slides_refresh_sheets_chart]
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Refreshes an embedded Sheets chart in a presentation.
 * @param {string} presentationId The ID of the presentation.
 * @param {string} presentationChartId The ID of the chart to refresh.
 * @return {Promise<object>} The response from the batch update.
 */
async function refreshSheetsChart(presentationId, presentationChartId) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  // Create a new Slides API client.
  const service = google.slides({version: 'v1', auth});

  // The request to refresh the chart.
  const requests = [
    {
      refreshSheetsChart: {
        objectId: presentationChartId,
      },
    },
  ];

  // Execute the batch update request to refresh the chart.
  const batchUpdateResponse = await service.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests,
    },
  });
  console.log(
    `Refreshed a linked Sheets chart with ID: ${presentationChartId}`,
  );
  return batchUpdateResponse.data;
}
// [END slides_refresh_sheets_chart]

export {refreshSheetsChart};
