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

// [START drive_share_file]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Shares a file with a user and a domain.
 * @param {string} fileId The ID of the file to share.
 * @param {string} targetUser The email address of the user to share with.
 * @param {string} targetDomain The domain to share with.
 * @return {Promise<string[]>} A list of the inserted permission IDs.
 */
async function shareFile(fileId, targetUser, targetDomain) {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client.
  const service = google.drive({version: 'v2', auth});

  const permissionIds = [];
  // The permissions to insert.
  const permissions = [
    {
      type: 'user',
      role: 'writer',
      value: targetUser, // e.g., 'user@example.com'
    },
    {
      type: 'domain',
      role: 'writer',
      value: targetDomain, // e.g., 'example.com'
    },
  ];

  // Note: The client library does not currently support batch requests for permissions.
  // When possible, use batch requests to insert multiple permissions on the same item.
  for (const permission of permissions) {
    try {
      // Insert the permission.
      const result = await service.permissions.insert({
        requestBody: permission,
        fileId,
        fields: 'id',
      });
      permissionIds.push(result.data.id);
      console.log(`Inserted permission id: ${result.data.id}`);
    } catch (err) {
      // TODO(developer): Handle failed permissions
      console.error(err);
    }
  }
  return permissionIds;
}
// [END drive_share_file]

export {shareFile};
