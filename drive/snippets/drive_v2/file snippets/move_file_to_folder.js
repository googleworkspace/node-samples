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

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Moves a file to a new folder in Google Drive.
 * @param {string} fileId The ID of the file to move.
 * @param {string} folderId The ID of the folder to move the file to.
 * @return {Promise<number>} The status of the move operation.
 */
async function moveFileToFolder(fileId, folderId) {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  // Get the file's metadata to retrieve its current parents.
  const file = await service.files.get({
    fileId,
    fields: 'parents',
  });

  // Get the current parents as a comma-separated string.
  const previousParents = (file.data.parents ?? [])
    .map((parent) => parent.id)
    .join(',');

  // Move the file to the new folder.
  const files = await service.files.update({
    fileId,
    addParents: folderId,
    removeParents: previousParents,
    fields: 'id, parents',
  });

  // Print the status of the move operation.
  console.log(files.status);
  return files.status;
}
// [END drive_move_file_to_folder]

export {moveFileToFolder};
