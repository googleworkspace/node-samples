// /**
// * Copyright 2022 Google LLC
// *
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// *
// *     https://www.apache.org/licenses/LICENSE-2.0
// *
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */
const {expect} = require('expect');
const Helpers = require('./helpers');
const SlidesCreateSheetsChart = require('../slides_create_sheets_chart');

// Replace with your test spreadsheets id and charts id
const CHART_ID = 1107320627;
const DATA_SPREADSHEET_ID = '17eqFZl_WK4WVixX8PjvjfLD77DraoFwMDXeiHB3dvuM';

describe('Presentation snippets', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  it('should CreateSheetsChart', async () => {
    const presentationId = await helpers.createTestPresentation();
    const pageIds = await helpers.addSlides(presentationId, 1, 'BLANK');
    const pageId = pageIds[0];
    const response = await SlidesCreateSheetsChart.createSheetsChart(
        presentationId,
        pageId,
        DATA_SPREADSHEET_ID,
        CHART_ID,
    );
    expect(1).toEqual(response.replies.length);
    const chartId = response.replies[0].createSheetsChart.objectId;
    expect(chartId).toBeDefined();
  });
});
