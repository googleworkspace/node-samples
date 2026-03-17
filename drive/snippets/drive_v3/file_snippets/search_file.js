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

// [START drive_search_file]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Searches for files in Google Drive.
 * @return {Promise<object[]>} A list of files.
 */
async function searchFile() {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client (v3).
  const service = google.drive({version: 'v3', auth});

  // Search for files with the specified query.
  const result = await service.files.list({
    q: "mimeType='image/jpeg'",
    fields: 'nextPageToken, files(id, name)',
    spaces: 'drive',
  });

  // Print the name and ID of each found file.
  (result.data.files ?? []).forEach((file) => {
    console.log('Found file:', file.name, file.id);
  });

  return result.data.files ?? [];
}
// [END drive_search_file]

export {searchFile};
