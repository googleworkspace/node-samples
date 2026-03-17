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

// [START drive_list_appdata]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Lists all files in the application data folder.
 * @return {Promise<object[]>} A list of files.
 */
async function listAppdata() {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive.appdata',
  });

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  // List the files in the application data folder.
  const result = await service.files.list({
    spaces: 'appDataFolder',
    fields: 'nextPageToken, items(id, title)',
    maxResults: 100,
  });

  // Print the title and ID of each file.
  (result.data.items ?? []).forEach((file) => {
    console.log('Found file:', file.title, file.id);
  });

  return result.data.items ?? [];
}
// [END drive_list_appdata]

export {listAppdata};
