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

// [START drive_upload_with_conversion]

import fs from 'node:fs';
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Uploads a file to Google Drive and converts it to a Google Sheet.
 * @return {Promise<string|null|undefined>} The ID of the uploaded file.
 */
async function uploadWithConversion() {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client (v3).
  const service = google.drive({version: 'v3', auth});

  // The metadata for the file to be uploaded and converted.
  const fileMetadata = {
    name: 'My Report',
    // The MIME type to convert the file to.
    mimeType: 'application/vnd.google-apps.spreadsheet',
  };

  // The media content to be uploaded.
  const media = {
    mimeType: 'text/csv',
    body: fs.createReadStream('files/report.csv'),
  };

  // Upload the file with conversion.
  const file = await service.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id',
  });

  // Print the ID of the uploaded file.
  console.log('File Id:', file.data.id);
  return file.data.id;
}
// [END drive_upload_with_conversion]

export {uploadWithConversion};
