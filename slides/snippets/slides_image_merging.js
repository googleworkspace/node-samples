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

// [START slides_image_merging]
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Replaces shapes in a presentation with images.
 * @param {string} templatePresentationId The ID of the template presentation.
 * @param {string} imageUrl The URL of the image to use.
 * @param {string} customerName The name of the customer for the new presentation title.
 * @return {Promise<object>} The response from the batch update.
 */
async function imageMerging(templatePresentationId, imageUrl, customerName) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/presentations',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  // Create new clients for Slides and Drive APIs.
  const slidesService = google.slides({version: 'v1', auth});
  const driveService = google.drive({version: 'v2', auth});

  const logoUrl = imageUrl;
  const customerGraphicUrl = imageUrl;

  // Duplicate the template presentation.
  const copyTitle = `${customerName} presentation`;
  const driveResponse = await driveService.files.copy({
    fileId: templatePresentationId,
    requestBody: {
      name: copyTitle,
    },
  });
  const presentationCopyId = driveResponse.data.id;

  // Create the image merge requests.
  const requests = [
    {
      replaceAllShapesWithImage: {
        imageUrl: logoUrl,
        replaceMethod: 'CENTER_INSIDE',
        containsText: {
          text: '{{company-logo}}',
          matchCase: true,
        },
      },
    },
    {
      replaceAllShapesWithImage: {
        imageUrl: customerGraphicUrl,
        replaceMethod: 'CENTER_INSIDE',
        containsText: {
          text: '{{customer-graphic}}',
          matchCase: true,
        },
      },
    },
  ];

  // Execute the requests to replace the shapes with images.
  const batchUpdateResponse = await slidesService.presentations.batchUpdate({
    presentationId: presentationCopyId,
    requestBody: {
      requests,
    },
  });

  // Count the total number of replacements made.
  let numReplacements = 0;
  for (let i = 0; i < batchUpdateResponse.data.replies.length; ++i) {
    numReplacements +=
      batchUpdateResponse.data.replies[i].replaceAllShapesWithImage
        .occurrencesChanged;
  }
  console.log(`Created merged presentation with ID: ${presentationCopyId}`);
  console.log(`Replaced ${numReplacements} shapes with images.`);
  return batchUpdateResponse.data;
}
// [END slides_image_merging]

export {imageMerging};
