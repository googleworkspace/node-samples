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
/**
 * Replaces text in the provided shape ID.
 * @param {string} presentationId The presentation ID.
 * @param {string} shapeId The shape ID to delete existing text and insert new text into.
 * @param {string} replacementText The new replacement text.
 */
async function simpleTextReplace(presentationId, shapeId, replacementText) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  const service = google.slides({version: 'v1', auth});
  // Remove existing text in the shape, then insert new text.
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
  // Execute the requests.
  try {
    const batchUpdateResponse = await service.presentations.batchUpdate({
      presentationId,
      resource: {
        requests,
      },
    });
    console.log(`Replaced text in shape with ID: ${shapeId}`);
    return batchUpdateResponse.data;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// [END slides_simple_text_replace]

module.exports = {simpleTextReplace};
