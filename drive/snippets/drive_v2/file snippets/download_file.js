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
// [START drive_download_file]

/**
 * Downloads a file
 * @param{string} realFileId file ID
 * */
async function downloadFile(realFileId) {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app

  const fs = require('fs');
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/drive'});
  const service = google.drive({version: 'v2', auth});

  const dest = fs.createWriteStream('/tmp/photo.jpg');
  fileId = realFileId;
  const buffers = [];
  try {
    await service.files.get({
      fileId: fileId,
      alt: 'media',
    }, {responseType: 'stream'},
    function( res) {
      res.data
          .on('data', function(chunk) {
            buffers.push(chunk);
          })
          .on('end', function() {
            console.log('Done');
            Buffer.concat(buffers);
          })
          .pipe(dest);
    },
    );
  } catch (err) {
    throw err;
  }
};
// [END drive_download_file]

module.exports = downloadFile;
if (module=== require.main) {
  downloadFile('1VOB_CrjAW7BVfNlfOGXLWYuQMyphmxgt');
}
