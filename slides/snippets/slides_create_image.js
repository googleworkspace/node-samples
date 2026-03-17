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
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Adds an image to a slide in a presentation.
 * @param {string} presentationId The ID of the presentation.
 * @param {string} pageId The ID of the page to add the image to.
 * @return {Promise<object>} The response from the batch update.
 */
async function createImage(presentationId, pageId) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  // Create a new Slides API client.
  const service = google.slides({version: 'v1', auth});

  // The URL of the image to add.
  const imageUrl =
    'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';

  // The ID to use for the new image.
  const imageId = 'MyImage_01';

  // The size of the new image in English Metric Units (EMUs).
  const emu4M = {
    magnitude: 4000000,
    unit: 'EMU',
  };

  // The request to create a new image.
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

  // Execute the batch update request to create the image.
  const response = await service.presentations.batchUpdate({
    presentationId,
    requestBody: {requests},
  });
  const createImageResponse = response.data.replies;
  console.log(
    `Created image with ID: ${createImageResponse[0].createImage.objectId}`,
  );
  return createImageResponse;
}
// [END slides_create_image]

export {createImage};
