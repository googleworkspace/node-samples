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
 * @return{obj} data file
 * */
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

async function searchFile() {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({version: 'v3', auth});
  const files = [];
  let pageToken = null;

  try {
    do {
      const res = await service.files.list({
        q: 'mimeType=\'image/jpeg\'',
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
        pageToken: pageToken,
      });
      res.data.files.forEach(function(file) {
        console.log('Found file:', file.name, file.id);
      });
      Array.prototype.push.apply(files, res.files);
      pageToken = res.nextPageToken;
    } while (pageToken);
    return files;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END drive_search_file]

export {searchFile};
