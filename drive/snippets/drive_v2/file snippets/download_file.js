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

// [START drive_download_file]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Downloads a file from Google Drive.
 * @param {string} fileId The ID of the file to download.
 * @return {Promise<number>} The status of the download.
 */
async function downloadFile(fileId) {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  // Download the file.
  const file = await service.files.get({
    fileId,
    alt: 'media',
  });

  // Print the status of the download.
  console.log(file.status);
  return file.status;
}
// [END drive_download_file]

export {downloadFile};
