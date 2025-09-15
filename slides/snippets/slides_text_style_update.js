/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START slides_text_style_update]
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Updates the text style of a shape in a presentation.
 * @param {string} presentationId The ID of the presentation.
 * @param {string} shapeId The ID of the shape to update.
 * @return {Promise<object>} The response from the batch update.
 */
async function textStyleUpdate(presentationId, shapeId) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  // Create a new Slides API client.
  const service = google.slides({version: 'v1', auth});

  // The requests to update the text style.
  const requests = [
    // Bold and italicize the first 5 characters.
    {
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
    },
    // Set the next 5 characters to 14pt Times New Roman, and blue.
    {
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
    },
    // Hyperlink the next 5 characters.
    {
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
    },
  ];

  // Execute the batch update request.
  const batchUpdateResponse = await service.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests,
    },
  });
  console.log(`Updated the text style for shape with ID: ${shapeId}`);
  return batchUpdateResponse.data;
}
// [END slides_text_style_update]

export {textStyleUpdate};
