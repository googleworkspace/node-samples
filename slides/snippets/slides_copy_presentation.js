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

// [START slides_copy_presentation]
/**
 * Copys a Google Slide presentation.
 * @param {string} presentationId The presentation to copy.
 * @param {string} copyTitle The new title.
 */
async function copyPresentation(presentationId, copyTitle) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  const service = google.drive({version: 'v2', auth});
  const request = {
    name: copyTitle,
  };

  try {
    const driveResponse = await service.files.copy({
      fileId: presentationId,
      resource: request,
    });
    const presentationCopyId = driveResponse.data.id;
    console.log('Created copied presentation with ID: ' + presentationCopyId);
    return driveResponse;
  } catch (err) {
    // TODO (developer) - handle exception
    throw err;
  }
}
// [END slides_copy_presentation]

module.exports = {copyPresentation};
