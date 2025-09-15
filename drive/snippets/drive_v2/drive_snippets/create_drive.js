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

// [START drive_create_drive]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';
import {v4 as uuid} from 'uuid';

/**
 * Creates a new shared drive.
 * @return {Promise<string>} The ID of the created shared drive.
 */
async function createDrive() {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  // The metadata for the new shared drive.
  const driveMetadata = {
    name: 'Project resources',
  };

  // A unique request ID to avoid creating duplicate shared drives.
  const requestId = uuid();

  // Create the new shared drive.
  const Drive = await service.drives.insert({
    requestBody: driveMetadata,
    requestId,
    fields: 'id',
  });

  // Print the ID of the new shared drive.
  console.log('Drive Id:', Drive.data.id);
  if (!Drive.data.id) {
    throw new Error('Drive ID not found.');
  }
  return Drive.data.id;
}
// [END drive_create_drive]

export {createDrive};
