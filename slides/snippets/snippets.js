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
 * Google Slides Snippets
 */
class SlidesSnippets {
  /**
   * Creates Slides Snippets with a Google API Services
   * @param {GoogleAuth[]} service Authenticated Drive, Slides, and Sheets Services
   */
  constructor([driveService, slidesService, sheetsService]) {
    this.driveService = driveService;
    this.slidesService = slidesService;
    this.sheetsService = sheetsService;
  }

  /**
   * Creates a Google Slide presentation.
   * @param {string} title The presentation title.
   * @return {Promise<Presentation>} The new presentation.
   */
  async createPresentation(title) {
    return new Promise((resolve, reject) => {
      // [START slides_create_presentation]
      this.slidesService.presentations.create({
        title,
      }, (err, presentation) => {
        console.log(`Created presentation with ID: ${presentation.presentationId}`);
        // [START_EXCLUDE silent]
        resolve(presentation);
        // [END_EXCLUDE]
      });
      // [END slides_create_presentation]
    });
  }

  /**
   * Copys a Google Slide presentation.
   * @param {string} presentationId The presentation to copy.
   * @param {string} copyTitle The new title.
   * @return {Promise<File>} The copied Drive file.
   */
  async copyPresentation(presentationId, copyTitle) {
    return new Promise((resolve, reject) => {
      // [START slides_copy_presentation]
      let request = {
        name: copyTitle,
      };
      this.driveService.files.copy({
        fileId: presentationId,
        resource: request,
      }, (err, driveResponse) => {
        let presentationCopyId = driveResponse.id;
        // [START_EXCLUDE silent]
        resolve(presentationCopyId);
        // [END_EXCLUDE]
      });
      // [END slides_copy_presentation]
    });
  }

  /**
   * Creates a new slide in a presentation.
   * @param {string} presentationId The presentation ID.
   * @param {string} pageId The object ID for the new slide.
   * @return {Promise<BatchUpdateResponse>} The batch update response.
   */
  async createSlide(presentationId, pageId) {
    return new Promise((resolve, reject) => {
      // [START slides_create_slide]
      let requests = [{
        createSlide: {
          objectId: pageId,
          insertionIndex: '1',
          slideLayoutReference: {
            predefinedLayout: 'TITLE_AND_TWO_COLUMNS',
          },
        },
      }];
      // If you wish to populate the slide with elements, add element create requests here,
      // using the pageId.

      // Execute the request.
      return this.slidesService.presentations.batchUpdate({
        presentationId,
        resource: {
          requests,
        },
      }, (err, res) => {
        console.log(`Created slide with ID: ${res.replies[0].createSlide.objectId}`);
        // [START_EXCLUDE silent]
        resolve(res);
        // [END_EXCLUDE]
      });
      // [END slides_create_slide]
    });
  }

  /**
   * Adds a textbox with text to a slide.
   * @param {string} presentationId The presentation ID.
   * @param {string} pageId The page to add the textbox to.
   * @return {Promise<BatchUpdateResponse>} The batch update response.
   */
  async createTextboxWithText(presentationId, pageId) {
    return new Promise((resolve, reject) => {
      // [START slides_create_textbox_with_text]
      // Create a new square textbox, using the supplied element ID.
      let elementId = 'MyTextBox_01';
      let pt350 = {
        magnitude: 350,
        unit: 'PT',
      };
      let requests = [{
        createShape: {
          objectId: elementId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: pageId,
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
      // Insert text into the box, using the supplied element ID.
      {
        insertText: {
          objectId: elementId,
          insertionIndex: 0,
          text: 'New Box Text Inserted!',
        },
      }];
      // Execute the request.
      this.slidesService.presentations.batchUpdate({
        presentationId,
        resource: {requests},
      }, (err, createTextboxWithTextResponse) => {
        let createShapeResponse = createTextboxWithTextResponse.replies[0].createShape;
        console.log(`Created textbox with ID: ${createShapeResponse.objectId}`);
        // [START_EXCLUDE silent]
        resolve(createTextboxWithTextResponse);
        // [END_EXCLUDE]
      });
      // [END slides_create_textbox_with_text]
    });
  }

  /**
   * Adds an image to a presentation.
   * @param {string} presentationId The presentation ID.
   * @param {string} pageId The presentation page ID.
   * @return {Promise<BatchUpdateResponse>} The batch update response.
   */
  async createImage(presentationId, pageId) {
    return new Promise((resolve, reject) => {
      let imageUrl =
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
      // [START slides_create_image]
      // Create a new image, using the supplied object ID, with content downloaded from imageUrl.
      let imageId = 'MyImage_01';
      let emu4M = {
        magnitude: 4000000,
        unit: 'EMU',
      };
      let requests = [{
        createImage: {
          objectId: imageId,
          url: imageUrl,
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

      // Execute the request.
      this.slidesService.presentations.batchUpdate({
        presentationId,
        resource: {requests},
      }, (err, response) => {
        let createImageResponse = response.replies;
        console.log(`Created image with ID: ${createImageResponse[0].createImage.objectId}`);
        // [START_EXCLUDE silent]
        resolve(createImageResponse);
        // [END_EXCLUDE]
      });
      // [END slides_create_image]
    });
  }

  /**
   * Adds data from a spreadsheet to a template presentation.
   * @param {string} templatePresentationId The template presentation ID.
   * @param {string} dataSpreadsheetId  The data spreadsheet ID.
   * @return {Promise<BatchUpdateReplies[]>} A list of batch update replies.
   */
  async textMerging(templatePresentationId, dataSpreadsheetId) {
    return new Promise((resolve, reject) => {
      // [START slides_text_merging]
      // Use the Sheets API to load data, one record per row.
      let responses = [];
      let dataRangeNotation = 'Customers!A2:M6';

      this.sheetsService.spreadsheets.values.get({
        spreadsheetId: dataSpreadsheetId,
        range: dataRangeNotation,
      }, (err, sheetsResponse) => {
        let values = sheetsResponse.values;

        // For each record, create a new merged presentation.
        for (let i = 0; i < values.length; ++i) {
          let row = values[i];
          let customerName = row[2]; // name in column 3
          let caseDescription = row[5]; // case description in column 6
          let totalPortfolio = row[11]; // total portfolio in column 12

          // Duplicate the template presentation using the Drive API.
          let copyTitle = customerName + ' presentation';
          let requests = {
            name: copyTitle,
          };

          this.driveService.files.copy({
            fileId: templatePresentationId,
            requests,
          }, (err, driveResponse) => {
            let presentationCopyId = driveResponse.id;
            // Create the text merge (replaceAllText) requests for this presentation.
            let requests = [{
              replaceAllText: {
                containsText: {
                  text: '{{customer-name}}',
                  matchCase: true,
                },
                replaceText: customerName,
              },
            }, {
              replaceAllText: {
                containsText: {
                  text: '{{case-description}}',
                  matchCase: true,
                },
                replaceText: caseDescription,
              },
            }, {
              replaceAllText: {
                containsText: {
                  text: '{{total-portfolio}}',
                  matchCase: true,
                },
                replaceText: totalPortfolio,
              },
            }];
            // Execute the requests for this presentation.
            this.slidesService.presentations.batchUpdate({
              presentationId: presentationCopyId,
              resource: {
                requests,
              },
            }, (err, batchUpdateResponse) => {
              let result = batchUpdateResponse;
              // [START_EXCLUDE silent]
              responses.push(result.replies);
              // [END_EXCLUDE]
              // Count the total number of replacements made.
              let numReplacements = 0;
              for (let i = 0; i < result.replies.length; ++i) {
                numReplacements += result.replies[i].replaceAllText.occurrencesChanged;
              }
              console.log(`Created presentation for ${customerName} with ID: ` +
                  presentationCopyId);
              console.log(`Replaced ${numReplacements} text instances`);
              // [START_EXCLUDE silent]
              if (responses.length === values.length) { // resolve for the last value
                resolve(responses);
              }
              // [END_EXCLUDE]
            });
          });
        }
      });
      // [END slides_text_merging]
    });
  }

  /**
   * Add an image to a template presentation.
   * @param {string} templatePresentationId The template presentation ID.
   * @param {string} imageUrl The image URL
   * @param {string} customerName A customer name used for the title
   * @return {Promise<BatchUpdateResponse>} The batch update response.
   */
  async imageMerging(templatePresentationId, imageUrl, customerName) {
    return new Promise((resolve, reject) => {
      let logoUrl = imageUrl;
      let customerGraphicUrl = imageUrl;
      // [START slides_image_merging]
      // Duplicate the template presentation using the Drive API.
      let copyTitle = customerName + ' presentation';
      this.driveService.files.copy({
        fileId: templatePresentationId,
        resource: {
          name: copyTitle,
        },
      }, (err, driveResponse) => {
        let presentationCopyId = driveResponse.id;

        // Create the image merge (replaceAllShapesWithImage) requests.
        let requests = [{
          replaceAllShapesWithImage: {
            imageUrl: logoUrl,
            replaceMethod: 'CENTER_INSIDE',
            containsText: {
              text: '{{company-logo}}',
              matchCase: true,
            },
          },
        }, {
          replaceAllShapesWithImage: {
            imageUrl: customerGraphicUrl,
            replaceMethod: 'CENTER_INSIDE',
            containsText: {
              text: '{{customer-graphic}}',
              matchCase: true,
            },
          },
        }];

        // Execute the requests for this presentation.
        this.slidesService.presentations.batchUpdate({
          presentationId: presentationCopyId,
          resource: {
            requests,
          },
        }, (err, batchUpdateResponse) => {
          let numReplacements = 0;
          for (let i = 0; i < batchUpdateResponse.replies.length; ++i) {
            numReplacements += batchUpdateResponse.replies[i]
                .replaceAllShapesWithImage.occurrencesChanged;
          }
          console.log(`Created merged presentation with ID: ${presentationCopyId}`);
          console.log(`Replaced ${numReplacements} shapes with images.`);
          // [START_EXCLUDE silent]
          resolve(batchUpdateResponse);
          // [END_EXCLUDE]
        });
      });
      // [END slides_image_merging]
    });
  }

  /**
   * Replaces text in the provided shape ID.
   * @param {string} presentationId The presentation ID.
   * @param {string} shapeId The shape ID to delete existing text and insert new text into.
   * @param {string} replacementText The new replacement text.
   * @return {Promise<BatchUpdateResponse>} The batch update response.
   */
  async simpleTextReplace(presentationId, shapeId, replacementText) {
    return new Promise((resolve, reject) => {
      // [START slides_simple_text_replace]
      // Remove existing text in the shape, then insert new text.
      let requests = [{
        deleteText: {
          objectId: shapeId,
          textRange: {
            type: 'ALL',
          },
        },
      }, {
        insertText: {
          objectId: shapeId,
          insertionIndex: 0,
          text: replacementText,
        },
      }];
      // Execute the requests.
      this.slidesService.presentations.batchUpdate({
        presentationId,
        resource: {
            requests,
          },
      }, (err, batchUpdateResponse) => {
        console.log(`Replaced text in shape with ID: ${shapeId}`);
        // [START_EXCLUDE silent]
        resolve(batchUpdateResponse);
        // [END_EXCLUDE]
      });
      // [END slides_simple_text_replace]
    });
  }

  /**
   * Updates text style for a specific presentation's shape ID.
   * @param {string} presentationId The presentation ID.
   * @param {string} shapeId The shape ID.
   * @return {Promise<BatchUpdateResponse>} A batch update response promise.
   */
  async textStyleUpdate(presentationId, shapeId) {
    return new Promise((resolve, reject) => {
      // [START slides_text_style_update]
      // Update the text style so that the first 5 characters are bolded
      // and italicized, the next 5 are displayed in blue 14 pt Times
      // New Roman font, and the next 5 are hyperlinked.
      let requests = [{
        updateTextStyle: {
          objectId: shapeId,
          textRange: {
            type: 'FIXED_RANGE',
            startIndex: 0,
            endIndex: 5,
          },
          style: {
            bold: true,
            italic: true,
          },
          fields: 'bold,italic',
        },
      }, {
        updateTextStyle: {
          objectId: shapeId,
          textRange: {
            type: 'FIXED_RANGE',
            startIndex: 5,
            endIndex: 10,
          },
          style: {
            fontFamily: 'Times New Roman',
            fontSize: {
              magnitude: 14,
              unit: 'PT',
            },
            foregroundColor: {
              opaqueColor: {
                rgbColor: {
                  blue: 1.0,
                  green: 0.0,
                  red: 0.0,
                },
              },
            },
          },
          fields: 'foregroundColor,fontFamily,fontSize',
        },
      }, {
        updateTextStyle: {
          objectId: shapeId,
          textRange: {
            type: 'FIXED_RANGE',
            startIndex: 10,
            endIndex: 15,
          },
          style: {
            link: {
              url: 'www.example.com',
            },
          },
          fields: 'link',
        },
      }];

      // Execute the requests.
      this.slidesService.presentations.batchUpdate({
        presentationId,
        resource: {
          requests,
        },
      }, (err, batchUpdateResponse) => {
        console.log(`Updated the text style for shape with ID: ${shapeId}`);
        // [START_EXCLUDE silent]
        resolve(batchUpdateResponse);
        // [END_EXCLUDE]
      });
      // [END slides_text_style_update]
    });
  }

  /**
   * Creates bulleted text for a presentation.
   * @param {string} presentationId The presentation ID.
   * @param {string} shapeId The shape ID to add bulleted text to.
   * @return {Promise<BatchUpdateResponse>} A promise to return a batch update response.
   */
  async createBulletedText(presentationId, shapeId) {
    return new Promise((resolve, reject) => {
      // [START slides_create_bulleted_text]
      // Add arrow-diamond-disc bullets to all text in the shape.
      let requests = [{
        createParagraphBullets: {
          objectId: shapeId,
          textRange: {
            type: 'ALL',
          },
          bulletPreset: 'BULLET_ARROW_DIAMOND_DISC',
        },
      }];

      // Execute the requests.
      this.slidesService.presentations.batchUpdate({
        presentationId,
        resource: {
          requests,
        },
      }, (err, batchUpdateResponse) => {
        console.log(`Added bullets to text in shape with ID: ${shapeId}`);
        // [START_EXCLUDE silent]
        resolve(batchUpdateResponse);
        // [END_EXCLUDE]
      });
      // [END slides_create_bulleted_text]
    });
  }

  /**
   * Embeds a Sheets chart onto a page in a presentation.
   * @param {string} presentationId The presentation ID.
   * @param {string} pageId The page ID.
   * @param {string} shapeId The shape ID.
   * @param {string} sheetChartId The sheet's chart ID.
   * @return {Promise<BatchUpdateResponse>} A promise to return the batch update response.
   */
  async createSheetsChart(presentationId, pageId, shapeId, sheetChartId) {
    return new Promise((resolve, reject) => {
      // [START slides_create_sheets_chart]
      // Embed a Sheets chart (indicated by the spreadsheetId and sheetChartId) onto
      // a page in the presentation. Setting the linking mode as "LINKED" allows the
      // chart to be refreshed if the Sheets version is updated.
      let emu4M = {
        magnitude: 4000000,
        unit: 'EMU',
      };
      let presentationChartId = 'MyEmbeddedChart';
      let requests = [{
        createSheetsChart: {
          objectId: presentationChartId,
          spreadsheetId: shapeId,
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

      // Execute the request.
      this.slidesService.presentations.batchUpdate({
        presentationId,
        resource: {
          requests,
        },
      }, (err, batchUpdateResponse) => {
        console.log(`Added a linked Sheets chart with ID: ${presentationChartId}`);
        console.log(err, batchUpdateResponse);
        // [END slides_create_sheets_chart]
        resolve(batchUpdateResponse);
      });
    });
  }

  /**
   * Refreshes an embedded sheet chart.
   * @param {string} presentationId The presentation ID.
   * @param {string} presentationChartId The presentation's chart ID.
   * @return {Promise<BatchUpdateResponse>} A promise to return the batch update response.
   */
  async refreshSheetsChart(presentationId, presentationChartId) {
    return new Promise((resolve, reject) => {
      // [START slides_refresh_sheets_chart]
      let requests = [{
        refreshSheetsChart: {
          objectId: presentationChartId,
        },
      }];

      // Execute the request.
      this.slidesService.presentations.batchUpdate({
        presentationId,
        resource: {
          requests,
        },
      }, (err, batchUpdateResponse) => {
        console.log(`Refreshed a linked Sheets chart with ID: ${presentationChartId}`);
        // [START_EXCLUDE silent]
        resolve(batchUpdateResponse);
        // [END_EXCLUDE]
      });
      // [END slides_refresh_sheets_chart]
    });
  }
}

module.exports = SlidesSnippets;
