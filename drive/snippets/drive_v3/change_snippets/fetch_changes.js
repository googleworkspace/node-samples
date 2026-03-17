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
 * @param {string} savedStartPageToken The page token obtained from `fetch_start_page_token.js`.
 */
async function fetchChanges(savedStartPageToken) {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive.readonly',
  });

  // Create a new Drive API client (v3).
  const service = google.drive({version: 'v3', auth});

  // The page token for the next page of changes.
  let pageToken = savedStartPageToken;

  // Loop to fetch all changes, handling pagination.
  do {
    const result = await service.changes.list({
      pageToken: savedStartPageToken,
      fields: '*',
    });

    // Process the changes.
    (result.data.changes ?? []).forEach((change) => {
      console.log('change found for file: ', change.fileId);
    });

    // Update the page token for the next iteration.
    pageToken = result.data.newStartPageToken ?? '';
  } while (pageToken);
}
// [END drive_fetch_changes]

export {fetchChanges};
