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

// [START slides_simple_text_replace]
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Replaces all text in a shape with new text.
 * @param {string} presentationId The ID of the presentation.
 * @param {string} shapeId The ID of the shape to update.
 * @param {string} replacementText The text to replace with.
 * @return {Promise<object>} The response from the batch update.
 */
async function simpleTextReplace(presentationId, shapeId, replacementText) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  // Create a new Slides API client.
  const service = google.slides({version: 'v1', auth});

  // The requests to delete the existing text and insert the new text.
  const requests = [
    {
      deleteText: {
        objectId: shapeId,
        textRange: {
          type: 'ALL',
        },
      },
    },
    {
      insertText: {
        objectId: shapeId,
        insertionIndex: 0,
        text: replacementText,
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
  console.log(`Replaced text in shape with ID: ${shapeId}`);
  return batchUpdateResponse.data;
}
// [END slides_simple_text_replace]

export {simpleTextReplace};
