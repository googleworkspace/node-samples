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

/**
 * List all files inserted in the application data folder
 * */
async function listAppdata() {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app

  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive.appdata',
  });
  const service = google.drive({version: 'v3', auth});
  try {
    const res = await service.files.list({
      spaces: 'appDataFolder',
      fields: 'nextPageToken, files(id, name)',
      pageSize: 100,
    });
    res.data.files.forEach(function(file) {
      console.log('Found file:', file.name, file.id);
    });
    return res.data.files;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END drive_list_appdata]

module.exports = listAppdata;
