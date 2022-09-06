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
/**
 * Add an image to a template presentation.
 * @param {string} templatePresentationId The template presentation ID.
 * @param {string} imageUrl The image URL
 * @param {string} customerName A customer name used for the title
 */
async function imageMerging(templatePresentationId, imageUrl, customerName) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/presentations',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  const slidesService = google.slides({version: 'v1', auth});
  const driveService = google.drive({version: 'v2', auth});
  const logoUrl = imageUrl;
  const customerGraphicUrl = imageUrl;

  // Duplicate the template presentation using the Drive API.
  const copyTitle = customerName + ' presentation';
  try {
    const driveResponse = await driveService.files.copy({
      fileId: templatePresentationId,
      resource: {
        name: copyTitle,
      },
    });
    const presentationCopyId = driveResponse.data.id;

    // Create the image merge (replaceAllShapesWithImage) requests.
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

    // Execute the requests for this presentation.
    const batchUpdateResponse = await slidesService.presentations.batchUpdate({
      presentationId: presentationCopyId,
      resource: {
        requests,
      },
    });
    let numReplacements = 0;
    for (let i = 0; i < batchUpdateResponse.data.replies.length; ++i) {
      numReplacements +=
        batchUpdateResponse.data.replies[i].replaceAllShapesWithImage
            .occurrencesChanged;
    }
    console.log(`Created merged presentation with ID: ${presentationCopyId}`);
    console.log(`Replaced ${numReplacements} shapes with images.`);
    return batchUpdateResponse.data;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
// [END slides_image_merging]

module.exports = {imageMerging};
