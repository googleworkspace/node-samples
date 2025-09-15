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

// [START drive_touch_file]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Updates the modification timestamp of a file.
 * @param {string} fileId The ID of the file to update.
 * @param {string} timestamp The new modification timestamp.
 * @return {Promise<string|null|undefined>} The modified timestamp.
 */
async function touchFile(fileId, timestamp) {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client (v3).
  const service = google.drive({version: 'v3', auth});

  // The metadata to update.
  const fileMetadata = {
    modifiedTime: new Date().toISOString(),
  };
  fileMetadata.modifiedTime = timestamp;

  // Update the file's modification timestamp.
  const file = await service.files.update({
    fileId,
    requestBody: fileMetadata,
    fields: 'id, modifiedTime',
  });

  // Print the new modification timestamp.
  console.log('Modified time:', file.data.modifiedTime);
  return file.data.modifiedTime;
}
// [END drive_touch_file]

export {touchFile};
