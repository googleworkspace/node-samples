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
// [START drive_move_file_to_folder]

/**
 * Change the file's modification timestamp.
 * @param{string} realFileId Id of the file to move
 * @param{string} realFolderId Id of the folder to move
 * @return{obj} file status
 * */
async function moveFileToFolder(realFileId, realFolderId) {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app

  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/drive'});
  const service = google.drive({version: 'v2', auth});
  fileId = realFileId;
  folderId = realFolderId;

  try {
    // Retrieve the existing parents to remove
    const file = await service.files.get({
      fileId: fileId,
      fields: 'parents',
    });

    // Move the file to the new folder
    const previousParents = file.data.parents.map(function(parent) {
      return parent.id;
    }).join(',');
    const files = await service.files.update({
      fileId: fileId,
      addParents: folderId,
      removeParents: previousParents,
      fields: 'id, parents',
    });
    console.log(files.status);
    return files.status;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END drive_move_file_to_folder]

module.exports = moveFileToFolder;
if (module === require.main) {
  moveFileToFolder('1dUiRSoAQKkM3a4nTPeNQWgiuau1KdQ_l',
      '1OLuK07-PTY7yYlur84stjtnyez2jRrjE');
}

