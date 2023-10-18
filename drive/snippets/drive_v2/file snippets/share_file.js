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

/**
 * Download a Document file in PDF format
 * @param{string} fileId file ID
 * @param{string} targetUser username
 * @param{string} targetDomain domain
 * */
async function shareFile(fileId, targetUser, targetDomain) {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app

  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({version: 'v2', auth});

  const permissionIds = [];
  const permissions = [
    {
      type: 'user',
      role: 'writer',
      value: targetUser, // Example: 'user@example.com',
    },
    {
      type: 'domain',
      role: 'writer',
      value: targetDomain, // Example: 'example.com',
    },
  ];

  // Note: Client library does not currently support HTTP batch
  // requests. When possible, use batched requests when inserting
  // multiple permissions on the same item. For this sample,
  // permissions are inserted serially.
  for (const permission of permissions) {
    try {
      const result = await service.permissions.insert({
        resource: permission,
        fileId: fileId,
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

module.exports = shareFile;
