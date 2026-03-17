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
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Creates a textbox with text on a slide.
 * @param {string} presentationId The ID of the presentation.
 * @param {string} pageId The ID of the page to add the textbox to.
 * @return {Promise<object>} The response from the batch update.
 */
async function createTextboxWithText(presentationId, pageId) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  // Create a new Slides API client.
  const service = google.slides({version: 'v1', auth});

  // The ID to use for the new textbox.
  const elementId = 'MyTextBox_01';

  // The size of the new textbox, in points.
  const pt350 = {
    magnitude: 350,
    unit: 'PT',
  };

  // The requests to create a textbox and add text to it.
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
    // Insert text into the new textbox.
    {
      insertText: {
        objectId: elementId,
        insertionIndex: 0,
        text: 'New Box Text Inserted!',
      },
    },
  ];

  // Execute the batch update request.
  const createTextboxWithTextResponse = await service.presentations.batchUpdate(
    {
      presentationId,
      requestBody: {requests},
    },
  );
  const createShapeResponse =
    createTextboxWithTextResponse.data.replies[0].createShape;
  console.log(`Created textbox with ID: ${createShapeResponse.objectId}`);
  return createTextboxWithTextResponse.data;
}
// [END slides_create_textbox_with_text]

export {createTextboxWithText};
