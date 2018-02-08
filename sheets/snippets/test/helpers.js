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
 * Helper functions for Google Sheets
 */
class Helpers {
  /**
   * Creates the Google API Service
   */
  constructor() {
    const client = this.buildAuthClient();
    this.sheetsService = client.then((auth) => googleapis.sheets({version: 'v4', auth}));
    this.driveService = client.then((auth) => googleapis.drive({version: 'v3', auth}));
    this.filesToDelete = [];
  }

  /**
   * Builds the Google Auth Client
   * @return {Promise} A promise to return the auth client.
   */
  buildAuthClient() {
    return new Promise((resolve, reject) => {
      (new GoogleAuth()).getApplicationDefault((err, authClient) => {
        if (err) return reject(err);
        let scopes = [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/spreadsheets',
        ];
        if (authClient.createScopedRequired &&
            authClient.createScopedRequired()) {
          authClient = authClient.createScoped(scopes);
        };
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
      this.filesToDelete.map((fileId) => drive.files.delete({fileId}));
    });
  }

  /**
   * Creates a test Spreadsheet.
   * @return {Promise} A promise to return the Google API service.
   */
  createTestSpreadsheet() {
    return this.sheetsService.then((sheets) => {
      const createSpreadsheet = Promise.denodeify(sheets.spreadsheets.create)
         .bind(sheets.spreadsheets);
      return createSpreadsheet({
        resource: {
          properties: {
            title: 'Test Spreadsheet',
          },
        },
        fields: 'spreadsheetId',
      })
      .then((spreadsheet) => {
        this.deleteFileOnCleanup(spreadsheet.spreadsheetId);
        return spreadsheet.spreadsheetId;
      });
    });
  }

  /**
   * Adds a string to a 11x11 grid of Spreadsheet cells.
   * @param {string} spreadsheetId The spreadsheet ID.
   * @return {Promise} A promise to return the Google API service.
   */
  populateValues(spreadsheetId) {
    return this.sheetsService.then((sheets) => {
      const batchUpdate = Promise.denodeify(sheets.spreadsheets.batchUpdate)
           .bind(sheets.spreadsheets);
      return batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 10,
                startColumnIndex: 0,
                endColumnIndex: 10,
              },
              cell: {
                userEnteredValue: {
                  stringValue: 'Hello',
                },
              },
              fields: 'userEnteredValue',
            },
          }],
        },
      })
      .then(() => spreadsheetId);
    });
  }
}

module.exports = Helpers;
