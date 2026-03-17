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
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Copies a presentation.
 * @param {string} presentationId The ID of the presentation to copy.
 * @param {string} copyTitle The title for the copied presentation.
 * @return {Promise<object>} The response from the copy request.
 */
async function copyPresentation(presentationId, copyTitle) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  // The request to copy the presentation.
  const request = {
    name: copyTitle,
  };

  // Copy the presentation.
  const driveResponse = await service.files.copy({
    fileId: presentationId,
    requestBody: request,
  });

  // Log the ID of the copied presentation.
  const presentationCopyId = driveResponse.data.id;
  console.log(`Created copied presentation with ID: ${presentationCopyId}`);
  return driveResponse;
}
// [END slides_copy_presentation]

export {copyPresentation};
