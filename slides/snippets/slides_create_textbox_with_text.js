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

// [START slides_create_textbox_with_text]
/**
 * Adds a textbox with text to a slide.
 * @param {string} presentationId The presentation ID.
 * @param {string} pageId The page to add the textbox to.
 */
async function createTextboxWithText(presentationId, pageId) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  const service = google.slides({version: 'v1', auth});
  const elementId = 'MyTextBox_01';
  const pt350 = {
    magnitude: 350,
    unit: 'PT',
  };
  const requests = [
    {
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
    },
  ];
  // Execute the request.
  try {
    const createTextboxWithTextResponse =
      await service.presentations.batchUpdate({
        presentationId,
        resource: {requests},
      });
    const createShapeResponse =
      createTextboxWithTextResponse.data.replies[0].createShape;
    console.log(`Created textbox with ID: ${createShapeResponse.objectId}`);
    return createTextboxWithTextResponse.data;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// [END slides_create_textbox_with_text]

module.exports = {createTextboxWithText};
