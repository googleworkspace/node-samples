/**
 * @license
 * Copyright Google Inc.
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
const Promise = require('promise');
const googleapis = require('googleapis');
const GoogleAuth = require('google-auth-library');

/**
 * Helper functions for Google Slides
 */
class Helpers {
  /**
   * Creates the Google API Service
   */
  constructor() {
    const client = this.buildAuthClient();
    this.driveService = client.then((auth) => googleapis.drive({version: 'v3', auth}));
    this.slidesService = client.then((auth) => googleapis.slides({version: 'v1', auth}));
    this.sheetsService = client.then((auth) => googleapis.sheets({version: 'v4', auth}));
    this.filesToDelete = [];
  }

  /**
   * Builds the Google Auth Client
   * @return {Promise} A promise to return the auth client.
   */
  buildAuthClient() {
    const googleAuth = new GoogleAuth();
    return new Promise((resolve, reject) => {
      googleAuth.getApplicationDefault((err, authClient) => {
        if (err) return reject(err);
        const scopes = [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/presentations',
            'https://www.googleapis.com/auth/spreadsheets',
        ];
        if (authClient.createScopedRequired &&
            authClient.createScopedRequired()) {
          authClient = authClient.createScoped(scopes);
        }
        resolve(authClient);
      });
    });
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
   * @return {Promise} A promise to return the Google API service.
   */
  cleanup() {
    return this.driveService.then((drive) => {
      const deleteFile = Promise.denodeify(drive.files.delete).bind(drive.files);
      return this.filesToDelete.map((fileId) => deleteFile({fileId}));
    });
  }

  /**
   * Creates an empty presentation.
   * @return {Promise<string>} A promise to return the presentation ID.
   */
  createTestPresentation() {
    return new Promise((resolve, reject) => {
      return this.slidesService.then((slides) => {
        slides.presentations.create({
          title: 'Test Preso',
        }, (err, presentation) => {
          if (err) return reject(err);
          this.deleteFileOnCleanup(presentation.presentationId);
          resolve(presentation.presentationId);
        });
      });
    });
  }

  /**
   * Adds slides to a presentation.
   * @param {string}   presentationId   The presentation ID
   * @param {number}   num              The number of slides to Add
   * @param {object}   predefinedLayout The slides' predefined layout
   * @return {Promise<string[]>} A list of slide ids.
   */
  addSlides(presentationId, num, predefinedLayout) {
    return new Promise((resolve, reject) => {
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
      this.slidesService.then((slides) => {
        slides.presentations.batchUpdate({
          presentationId,
          resource: {
            requests,
          },
        }, (err, response) => {
          if (err) return reject(err);
          resolve(slideIds);
        });
      });
    });
  }

  /**
   * Creates a test textbox
   * @param  {string}   presentationId The presentation ID.
   * @param  {string}   pageObjectId   The element page object ID.
   * @return {Promise<string>} The textbox's object ID.
   */
  createTestTextbox(presentationId, pageObjectId) {
    return new Promise((resolve, reject) => {
      const boxId = 'MyTextBox_01';
      const pt350 = {
        magnitude: 350,
        unit: 'PT',
      };
      const requests = [{
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
      }, {
        insertText: {
          objectId: boxId,
          insertionIndex: 0,
          text: 'New Box Text Inserted',
        },
      }];
      this.slidesService.then((slides) => {
        slides.presentations.batchUpdate({
          presentationId,
          resource: {
            requests,
          },
        }, (err, createTextboxResponse) => {
          if (err) return reject(err);
          resolve(createTextboxResponse.replies[0].createShape.objectId);
        });
      });
    });
  }

  /**
   * Creates a test spreadsheet chart
   * @param  {string}   presentationId The presentation ID
   * @param  {string}   pageId         The element page object ID
   * @param  {string}   spreadsheetId  The Sheet's ID
   * @param  {string}   sheetChartId   The Sheet's Chart ID
   * @return {Promise<string>} The chart's object ID
   */
  createTestSheetsChart(presentationId, pageId, spreadsheetId, sheetChartId) {
    return new Promise((resolve, reject) => {
      const chartId = 'MyChart_01';
      const emu4M = {
        magnitude: 4000000,
        unit: 'EMU',
      };
      const requests = [{
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
      }];
      this.slidesService.then((slides) => {
        slides.presentations.batchUpdate({
          presentationId,
          resource: {
            requests,
          },
        }, (err, createSheetsChartResponse) => {
          if (err) return reject(err);
          resolve(createSheetsChartResponse.replies[0].createSheetsChart.objectId);
        });
      });
    });
  }
}

module.exports = Helpers;
