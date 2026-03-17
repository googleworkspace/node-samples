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

// [START drive_fetch_changes]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Fetches the list of changes for the currently authenticated user.
 * @return {Promise<object[]>} A list of changes.
 */
async function fetchChanges() {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  // The page token for the next page of changes. If not set, the first page is retrieved.
  let pageToken;

  // Fetch the list of changes.
  const result = await service.changes.list({
    pageToken,
    fields: '*',
  });

  // Process the changes.
  (result.data.items ?? []).forEach((change) => {
    console.log('Change found for file:', change.fileId);
  });

  return result.data.items ?? [];
}
// [END drive_fetch_changes]

export {fetchChanges};
