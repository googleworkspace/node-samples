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
const {google} = require('googleapis');
const {GoogleAuth} = require('google-auth-library');

/**
 * Helper functions for Google Slides
 */
class Helpers {
  /**
   * Creates the Google API Service
   */
  constructor() {
    const auth = new GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/presentations',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });
    this.driveService = google.drive({version: 'v3', auth});
    this.slidesService = google.slides({version: 'v1', auth});
    this.sheetsService = google.sheets({version: 'v4', auth});
    this.filesToDelete = [];
  }

  /**
   * Resets the test suite.
   */
  reset() {
    this.filesToDelete = [];
  }

  /**
   * Adds the Drive file ID for deletion on cleanup.
   * @param {string} id The Drive file ID.
   */
  deleteFileOnCleanup(id) {
    this.filesToDelete.push(id);
  }

  /**
   * Cleans up the test suite.
   * @return {Promise} returns a list of promises
   */
  cleanup() {
    return Promise.all(
        this.filesToDelete.map((fileId) =>
          this.driveService.files.delete({fileId}),
        ),
    );
  }

  /**
   * Creates an empty presentation.
   * @return {Promise<string>} A promise to return the presentation ID.
   */
  async createTestPresentation() {
    const res = await this.slidesService.presentations.create({
      title: 'Test Preso',
    });
    this.deleteFileOnCleanup(res.data.presentationId);
    return res.data.presentationId;
  }

  /**
   * Adds slides to a presentation.
   * @param {string}   presentationId   The presentation ID
   * @param {number}   num              The number of slides to Add
   * @param {object}   predefinedLayout The slides' predefined layout
   * @return {Promise<string[]>} A list of slide ids.
   */
  async addSlides(presentationId, num, predefinedLayout) {
    const requests = [];
    const slideIds = [];
    for (let i = 0; i < num; ++i) {
      slideIds.push(`slide_${i}`);
      requests.push({
        createSlide: {
          objectId: slideIds[i],
          slideLayoutReference: {
            predefinedLayout,
          },
        },
      });
    }
    await this.slidesService.presentations.batchUpdate({
      presentationId,
      resource: {
        requests,
      },
    });
    return slideIds;
  }

  /**
   * Creates a test textbox
   * @param  {string}   presentationId The presentation ID.
   * @param  {string}   pageObjectId   The element page object ID.
   * @return {Promise<string>} The textbox's object ID.
   */
  async createTestTextbox(presentationId, pageObjectId) {
    const boxId = 'MyTextBox_01';
    const pt350 = {
      magnitude: 350,
      unit: 'PT',
    };
    const requests = [
      {
        createShape: {
          objectId: boxId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId,
            size: {
              height: pt350,
              width: pt350,
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 350,
              translateY: 100,
              unit: 'PT',
            },
          },
        },
      },
      {
        insertText: {
          objectId: boxId,
          insertionIndex: 0,
          text: 'New Box Text Inserted',
        },
      },
    ];
    const res = await this.slidesService.presentations.batchUpdate({
      presentationId,
      resource: {
        requests,
      },
    });
    return res.data.replies[0].createShape.objectId;
  }

  /**
   * Creates a test spreadsheet chart
   * @param  {string}   presentationId The presentation ID
   * @param  {string}   pageId         The element page object ID
   * @param  {string}   spreadsheetId  The Sheet's ID
   * @param  {string}   sheetChartId   The Sheet's Chart ID
   * @return {Promise<string>} The chart's object ID
   */
  async createTestSheetsChart(
      presentationId,
      pageId,
      spreadsheetId,
      sheetChartId,
  ) {
    const chartId = 'MyChart_01';
    const emu4M = {
      magnitude: 4000000,
      unit: 'EMU',
    };
    const requests = [
      {
        createSheetsChart: {
          objectId: chartId,
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

    const res = await this.slidesService.presentations.batchUpdate({
      presentationId,
      resource: {
        requests,
      },
    });
    return res.data.replies[0].createSheetsChart.objectId;
  }

  /**
   * Creates a test Spreadsheet.
   * @return {Promise} A promise to return the Google API service.
   */
  async createTestSpreadsheet() {
    const res = await this.sheetsService.spreadsheets.create({
      resource: {
        properties: {
          title: 'Test Spreadsheet',
        },
      },
      fields: 'spreadsheetId',
    });

    this.deleteFileOnCleanup(res.data.spreadsheetId);
    return res.data.spreadsheetId;
  }

  /**
   * Adds a string to a 11x11 grid of Spreadsheet cells.
   * @param {string} spreadsheetId The spreadsheet ID.
   * @return {Promise} A promise to return the Google API service.
   */
  async populateValues(spreadsheetId) {
    await this.sheetsService.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 15,
                startColumnIndex: 0,
                endColumnIndex: 15,
              },
              cell: {
                userEnteredValue: {
                  stringValue: 'Hello',
                },
              },
              fields: 'userEnteredValue',
            },
          },
        ],
      },
    });
    return spreadsheetId;
  }
}

module.exports = Helpers;
