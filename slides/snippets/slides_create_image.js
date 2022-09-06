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

// [START slides_create_image]
/**
 * Adds an image to a presentation.
 * @param {string} presentationId The presentation ID.
 * @param {string} pageId The presentation page ID.
 */
async function createImage(presentationId, pageId) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  const service = google.slides({version: 'v1', auth});

  const imageUrl =
    'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
  // Create a new image, using the supplied object ID, with content downloaded from imageUrl.
  const imageId = 'MyImage_01';
  const emu4M = {
    magnitude: 4000000,
    unit: 'EMU',
  };
  const requests = [
    {
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
    },
  ];

  // Execute the request.
  try {
    const response = await service.presentations.batchUpdate({
      presentationId,
      resource: {requests},
    });
    const createImageResponse = response.data.replies;
    console.log(
        `Created image with ID: ${createImageResponse[0].createImage.objectId}`,
    );
    return createImageResponse;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// [END slides_create_image]

module.exports = {createImage};
