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
// [START drive_touch_file]

/**
 * Change the file's modification timestamp.
 * @param{string} fileId ID of the file to change modified time
 * @param{string} Timestamp Timestamp to override Modified date time of the file
 * @return{obj} modified Timestamp
 **/
async function touchFile(fileId, Timestamp) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({version: 'v3', auth});
  const fileMetadata = {
    modifiedTime: new Date().toISOString(),
  };
  fileMetadata.modifiedTime = Timestamp;
  try {
    const file = await service.files.update({
      fileId: fileId,
      requestBody: fileMetadata,
      fields: 'id, modifiedTime',
    });
    console.log('Modified time:', file.data.modifiedTime);
    return file.data.modifiedTime;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END drive_touch_file]

module.exports = touchFile;
