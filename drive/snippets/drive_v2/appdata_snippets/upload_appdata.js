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

// [START drive_upload_appdata]

import fs from 'node:fs';
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Uploads a file to the application data folder.
 * @return {Promise<string>} The ID of the uploaded file.
 */
async function uploadAppdata() {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive.appdata',
  });

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  // The metadata for the file to be uploaded.
  const fileMetadata = {
    title: 'config.json',
    parents: [
      {
        id: 'appDataFolder',
      },
    ],
  };

  // The media content to be uploaded.
  const media = {
    mimeType: 'application/json',
    body: fs.createReadStream('files/config.json'),
  };

  // Upload the file to the application data folder.
  const file = await service.files.insert({
    requestBody: fileMetadata,
    media,
    fields: 'id',
  });

  // Print the ID of the uploaded file.
  console.log('File Id:', file.data.id);
  if (!file.data.id) {
    throw new Error('File ID not found.');
  }
  return file.data.id;
}
// [END drive_upload_appdata]

export {uploadAppdata};
