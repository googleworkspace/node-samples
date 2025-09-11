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
 * Batch permission modification
 *
 * @param{string} fileId file ID
 * @param{string} targetUserEmail username
 * @param{string} targetDomainName domain
 * @return{Promise<Array<string>>} permission id
 */
async function shareFile(fileId, targetUserEmail, targetDomainName) {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({version: 'v3', auth});
  /** @type {Array<string>} */
  const permissionIds = [];

  const permissions = [
    {
      type: 'user',
      role: 'writer',
      emailAddress: targetUserEmail, // 'user@partner.com',
    },
    {
      type: 'domain',
      role: 'writer',
      domain: targetDomainName, // 'example.com',
    },
  ];

  for (const permission of permissions) {
    const result = await service.permissions.create({
      requestBody: permission,
      fileId,
      fields: 'id',
    });

    if (!result.data.id) {
      throw new Error('Failed to create permission');
    }

    permissionIds.push(result.data.id);
    console.log(`Inserted permission id: ${result.data.id}`);
  }
  return permissionIds;
}
// [END drive_share_file]

export {shareFile};
