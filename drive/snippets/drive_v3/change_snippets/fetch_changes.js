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

/**
 * Retrieve the list of changes for the currently authenticated user.
 * @param {string} savedStartPageToken page token got after executing fetch_start_page_token.js file
 **/
async function fetchChanges(savedStartPageToken) {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app

  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive.readonly',
  });
  const service = google.drive({version: 'v3', auth});
  try {
    let pageToken = savedStartPageToken;
    do {
      const res = await service.changes.list({
        pageToken: savedStartPageToken,
        fields: '*',
      });
      res.data.changes.forEach((change) => {
        console.log('change found for file: ', change.fileId);
      });
      pageToken = res.data.newStartPageToken;
      return pageToken;
    } while (pageToken);
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END drive_fetch_changes]

module.exports = fetchChanges;
