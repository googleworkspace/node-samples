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
 * Find all shared drives without an organizer and add one.
 * @param{string} userEmail user ID to assign ownership to
 */
async function recoverDrives(userEmail) {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({version: 'v3', auth});
  const newOrganizerPermission = {
    type: 'user',
    role: 'organizer',
    emailAddress: userEmail, // Example: 'user@example.com'
  };

  const result = await service.drives.list({
    q: 'organizerCount = 0',
    fields: 'nextPageToken, drives(id, name)',
    useDomainAdminAccess: true,
  });

  for (const drive of result.data.drives ?? []) {
    if (!drive.id) {
      continue;
    }

    console.log('Found shared drive without organizer:', drive.name, drive.id);
    await service.permissions.create({
      requestBody: newOrganizerPermission,
      fileId: drive.id,
      useDomainAdminAccess: true,
      supportsAllDrives: true,
      fields: 'id',
    });
  }
  return result.data.drives;
}
// [END drive_recover_drives]

export {recoverDrives};
