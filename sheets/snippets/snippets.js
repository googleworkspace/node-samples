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

/**
 * Google Sheets Snippets
 */
class SheetsSnippets {
  /**
   * Creates Sheets Snippets with a Google API Services
   * @param {GoogleAuth[]} service Authenticated Google Drive and Sheets Services
   */
  constructor([driveService, sheetsService]) {
    this.driveService = driveService;
    this.sheetsService = sheetsService;
  }

  /**
   * Creates a new Google Spreadsheet.
   * @param {string} title The spreadsheet title
   * @return {Promise<string>} The spreadsheet ID
   */
  async create(title) {
    return new Promise((resolve, reject) => {
      // [START sheets_create]
      const resource = {
        properties: {
          title,
        },
      };
      this.sheetsService.spreadsheets.create({
        resource,
        fields: 'spreadsheetId',
      }, (err, spreadsheet) =>{
        if (err) {
          // Handle error.
          console.log(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log(`Spreadsheet ID: ${spreadsheet.spreadsheetId}`);
          // [START_EXCLUDE silent]
          resolve(spreadsheet.spreadsheetId);
          // [END_EXCLUDE]
        }
      });
      // [END sheets_create]
    });
  }

  /**
   * Updates the Spreadsheet title. Finds and replaces a string in the sheets.
   * @param {string} spreadsheetId The Spreadsheet to update
   * @param {string} title The new Spreadsheet title
   * @param {string} find The text to find
   * @param {string} replacement The text to replace
   * @return {Promise<BatchUpdateResponse>} The batch update response.
   */
  async batchUpdate(spreadsheetId, title, find, replacement) {
    return new Promise((resolve, reject) => {
      // [START sheets_batch_update]
      let requests = [];
      // Change the spreadsheet's title.
      requests.push({
        updateSpreadsheetProperties: {
          properties: {
            title,
          },
          fields: 'title',
        },
      });
      // Find and replace text.
      requests.push({
        findReplace: {
          find,
          replacement,
          allSheets: true,
        },
      });
      // Add additional requests (operations) ...
      const batchUpdateRequest = {requests};
      this.sheetsService.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: batchUpdateRequest,
      }, (err, response) => {
        if (err) {
          // Handle error
          console.log(err);
          // [START_EXCLUDE silent]
          return reject(err);
          // [END_EXCLUDE]
        } else {
          const findReplaceResponse = response.replies[1].findReplace;
          console.log(`${findReplaceResponse.occurrencesChanged} replacements made.`);
        }
        // [START_EXCLUDE silent]
        resolve(response);
        // [END_EXCLUDE]
      });
      // [END sheets_batch_update]
    });
  }

  /**
   * Gets cell values from a Spreadsheet.
   * @param {string} spreadsheetId The spreadsheet ID.
   * @param {string} range The sheet range.
   * @return {Promise<ValueResponse>} The value response.
   */
  async getValues(spreadsheetId, range) {
    return new Promise((resolve, reject) => {
      // [START sheets_get_values]
      this.sheetsService.spreadsheets.values.get({
        spreadsheetId,
        range,
      }, (err, result) => {
        if (err) {
          // Handle error
          console.log(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          const numRows = result.values ? result.values.length : 0;
          console.log(`${numRows} rows retrieved.`);
          // [START_EXCLUDE silent]
          resolve(result);
          // [END_EXCLUDE]
        }
      });
      // [END sheets_get_values]
    });
  };

  /**
   * Batch gets cell values from a Spreadsheet.
   * @param {string} spreadsheetId The spreadsheet ID.
   * @param {string} _ranges The mock sheet range.
   * @return {Promise<ValueResponse>} The value response.
   */
  async batchGetValues(spreadsheetId, _ranges) {
    return new Promise((resolve, reject) => {
      // [START sheets_batch_get_values]
      let ranges = [
        // Range names ...
      ];
      // [START_EXCLUDE silent]
      ranges = _ranges;
      // [END_EXCLUDE]
      this.sheetsService.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges,
      }, (err, result) => {
        if (err) {
          // Handle error
          console.log(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log(`${result.valueRanges.length} ranges retrieved.`);
          // [START_EXCLUDE silent]
          resolve(result);
          // [END_EXCLUDE]
        }
      });
      // [END sheets_batch_get_values]
    });
  };

  /**
   * Updates values in a Spreadsheet.
   * @param {string} spreadsheetId The spreadsheet ID.
   * @param {string} range The range of values to update.
   * @param {object} valueInputOption Value update options.
   * @param {(string[])[]} _values A 2d array of values to update.
   * @return {Promise<ValueUpdateResponse>} The updated values response.
   */
  async updateValues(spreadsheetId, range, valueInputOption, _values) {
    return new Promise((resolve, reject) => {
      // [START sheets_update_values]
      let values = [
        [
          // Cell values ...
        ],
        // Additional rows ...
      ];
      // [START_EXCLUDE silent]
      values = _values;
      // [END_EXCLUDE]
      const resource = {
        values,
      };
      this.sheetsService.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      }, (err, result) => {
        if (err) {
          // Handle error
          console.log(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log('%d cells updated.', result.updatedCells);
          // [START_EXCLUDE silent]
          resolve(result);
          // [END_EXCLUDE]
        }
      });
      // [END sheets_update_values]
    });
  }

  /**
   * Batch Updates values in a Spreadsheet.
   * @param {string} spreadsheetId The spreadsheet ID.
   * @param {string} range The range of values to update.
   * @param {object} valueInputOption Value update options.
   * @param {(string[])[]} _values A 2d array of values to update.
   * @return {Promise<ValueUpdateResponse>} The updated values response.
   */
  async batchUpdateValues(spreadsheetId, range, valueInputOption, _values) {
    return new Promise((resolve, reject) => {
      // [START sheets_batch_update_values]
      let values = [
        [
          // Cell values ...
        ],
        // Additional rows ...
      ];
      // [START_EXCLUDE silent]
      values = _values;
      // [END_EXCLUDE]
      const data = [{
        range,
        values,
      }];
      // Additional ranges to update ...
      const resource = {
        data,
        valueInputOption,
      };
      this.sheetsService.spreadsheets.values.batchUpdate({
        spreadsheetId,
        resource,
      }, (err, result) => {
        if (err) {
          // Handle error
          console.log(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log('%d cells updated.', result.totalUpdatedCells);
          // [START_EXCLUDE silent]
          resolve(result);
          // [END_EXCLUDE]
        }
      });
      // [END sheets_batch_update_values]
    });
  }

  /**
   * Appends values in a Spreadsheet.
   * @param {string} spreadsheetId The spreadsheet ID.
   * @param {string} range The range of values to append.
   * @param {object} valueInputOption Value input options.
   * @param {(string[])[]} _values A 2d array of values to append.
   * @return {Promise} The appended values response.
   */
  async appendValues(spreadsheetId, range, valueInputOption, _values) {
    return new Promise((resolve, reject) => {
      // [START sheets_append_values]
      let values = [
        [
          // Cell values ...
        ],
        // Additional rows ...
      ];
      // [START_EXCLUDE silent]
      values = _values;
      // [END_EXCLUDE]
      let resource = {
        values,
      };
      this.sheetsService.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      }, (err, result) => {
        if (err) {
          // Handle error.
          console.log(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log(`${result.updates.updatedCells} cells appended.`);
          // [START_EXCLUDE silent]
          resolve(result);
          // [END_EXCLUDE]
        }
      });
      // [END sheets_append_values]
    });
  }

  /**
   * Adds a pivot table to a spreadsheet.
   * @param {string} spreadsheetId The Spreadsheet to add the pivot table to.
   * @return {Promise<BatchUpdateResponse>} The batch update response.
   */
  async pivotTable(spreadsheetId) {
    return new Promise((resolve, reject) => {
      // Create two sheets for our pivot table
      const requests = [{
        addSheet: {},
      }, {
        addSheet: {},
      }];
      const resource = {requests};
      this.sheetsService.spreadsheets.batchUpdate({
        spreadsheetId,
        resource,
      }, (err, response) => {
        if (err) {
          // Handle error.
          console.log(err);
          // [START_EXCLUDE silent]
          return reject(err);
          // [END_EXCLUDE]
        } else {
          const sourceSheetId = response.replies[0].addSheet.properties.sheetId;
          const targetSheetId = response.replies[1].addSheet.properties.sheetId;
          // [START sheets_pivot_tables]
          const requests = [{
            updateCells: {
              rows: {
                values: [{
                    pivotTable: {
                      source: {
                        sheetId: sourceSheetId,
                        startRowIndex: 0,
                        startColumnIndex: 0,
                        endRowIndex: 20,
                        endColumnIndex: 7,
                      },
                      rows: [{
                        sourceColumnOffset: 1,
                        showTotals: true,
                        sortOrder: 'ASCENDING',
                      }],
                      columns: [{
                        sourceColumnOffset: 4,
                        sortOrder: 'ASCENDING',
                        showTotals: true,
                      }],
                      values: [{
                        summarizeFunction: 'COUNTA',
                        sourceColumnOffset: 4,
                      }],
                      valueLayout: 'HORIZONTAL',
                    },
                  },
                ],
              },
              start: {
                sheetId: targetSheetId,
                rowIndex: 0,
                columnIndex: 0,
              },
              fields: 'pivotTable',
            },
          }];

          const resource = {
            requests,
          };
          this.sheetsService.spreadsheets.batchUpdate({
            spreadsheetId,
            resource,
          }, (err, response) => {
            if (err) {
              // Handle error.
              console.log(err);
              // [START_EXCLUDE silent]
              return reject(err);
              // [END_EXCLUDE]
            } else {
              // [START_EXCLUDE silent]
              resolve(response);
              // [END_EXCLUDE]
            }
          });
          // [END sheets_pivot_tables]
        }
      });
    });
  }

  /**
   * Conditionally formats a Spreadsheet.
   * @param {string} spreadsheetId A Spreadsheet ID.
   * @return {Promise<BatchUpdateResponse>} The batch update response.
   */
  conditionalFormatting(spreadsheetId) {
    return new Promise((resolve, reject) => {
      // [START sheets_conditional_formatting]
      const myRange = {
        sheetId: 0,
        startRowIndex: 1,
        endRowIndex: 11,
        startColumnIndex: 0,
        endColumnIndex: 4,
      };
      const requests = [{
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
      }, {
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
      }];

      const resource = {
        requests,
      };
      this.sheetsService.spreadsheets.batchUpdate({
        spreadsheetId,
        resource,
      }, (err, response) => {
        if (err) {
          // Handle error.
          console.log(err);
          // [START_EXCLUDE silent]
          return reject(err);
          // [END_EXCLUDE]
        } else {
          console.log(`${response.replies.length} cells updated.`);
          // [START_EXCLUDE silent]
          resolve(response);
          // [END_EXCLUDE]
        }
      });
      // [END sheets_conditional_formatting]
    });
  }
}

module.exports = SheetsSnippets;
