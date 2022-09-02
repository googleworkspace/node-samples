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

/**
 * Search file in drive location
 * */
async function searchFile() {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app

  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({version: 'v2', auth});
  const files = [];
  const pageToken = null;
  try {
    const res = await service.files.list({
      q: 'mimeType=\'image/jpeg\'',
      fields: 'nextPageToken, items(id, title)',
      spaces: 'drive',
      pageToken: pageToken,
    });
    Array.prototype.push.apply(files, res.items);
    res.data.items.forEach(function(file) {
      console.log('Found file:', file.title, file.id);
    });
    return res.data.items;
  } catch (err) {
    throw err;
  }
}
// [END drive_search_file]

module.exports = searchFile;
