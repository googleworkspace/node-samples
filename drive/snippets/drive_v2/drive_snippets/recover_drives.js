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

// [START drive_recover_drives]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Finds all shared drives without an organizer and adds one.
 * @param {string} userEmail The email of the user to make an organizer.
 */
async function recoverDrives(userEmail) {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  // The permission to add to the shared drive.
  const newOrganizerPermission = {
    type: 'user',
    role: 'organizer',
    value: userEmail,
  };

  // List all shared drives with no organizers.
  const result = await service.drives.list({
    q: 'organizerCount = 0',
    fields: 'nextPageToken, items(id, name)',
    useDomainAdminAccess: true,
  });

  // Add the new organizer to each found shared drive.
  for (const drive of result.data.items ?? []) {
    if (!drive.id) {
      continue;
    }

    console.log('Found shared drive without organizer:', drive.name, drive.id);
    await service.permissions.insert({
      requestBody: newOrganizerPermission,
      fileId: drive.id,
      useDomainAdminAccess: true,
      supportsAllDrives: true,
      fields: 'id',
    });
  }
}
// [END drive_recover_drives]

export {recoverDrives};
