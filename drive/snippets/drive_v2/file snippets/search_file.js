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

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  // The page token for the next page of results. If not set, the first page is retrieved.
  const pageToken = undefined;

  // Search for files with the specified query.
  const result = await service.files.list({
    q: "mimeType='image/jpeg'",
    fields: 'nextPageToken, items(id, title)',
    spaces: 'drive',
    pageToken,
  });

  // Print the title and ID of each found file.
  (result.data.items ?? []).forEach((file) => {
    console.log('Found file:', file.title, file.id);
  });

  return result.data.items ?? [];
}
// [END drive_search_file]

export {searchFile};
