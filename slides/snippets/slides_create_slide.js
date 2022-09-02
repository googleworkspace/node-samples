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

// [START slides_create_slide]
/**
 * Creates a new slide in a presentation.
 * @param {string} presentationId The presentation ID.
 * @param {string} pageId The object ID for the new slide.
 */
async function createSlide(presentationId, pageId) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  const service = google.slides({version: 'v1', auth});
  const requests = [
    {
      createSlide: {
        objectId: pageId,
        insertionIndex: '1',
        slideLayoutReference: {
          predefinedLayout: 'TITLE_AND_TWO_COLUMNS',
        },
      },
    },
  ];
  // If you wish to populate the slide with elements, add element create requests here,
  // using the pageId.

  // Execute the request.
  try {
    const res = await service.presentations.batchUpdate({
      presentationId,
      resource: {
        requests,
      },
    });
    console.log(
        `Created slide with ID: ${res.data.replies[0].createSlide.objectId}`,
    );
    return res;
  } catch (err) {
    // TODO (developer) - handle exception
    throw err;
  }
}
// [END slides_create_slide]

module.exports = {createSlide};
