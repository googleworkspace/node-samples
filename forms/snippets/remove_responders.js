// Copyright 2025 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START forms_remove_responder]
import path from 'path';
import {drive} from '@googleapis/drive';
import {authenticate} from '@google-cloud/local-auth';

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

/**
 * Remove a responder to the form.
 *
 * @param {string} formId The ID of the form.
 * @param {string} email The email of the responder.
 */
async function removeResponders(formId, email) {
  const authClient = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  const driveService = drive({version: 'v3', auth: authClient});

  try {
    const res = await driveService.permissions.list({
      fileId: formId,
      includePermissionsForView: 'published',
      fields: 'permissions(id,emailAddress,type,role,view)',
    });

    const permissions = res.data.permissions || [];
    const responderToRemove = permissions.find(
        (permission) => permission.view === 'published' &&
            permission.role === 'reader' && permission.emailAddress === email);

    if (responderToRemove) {
      const permissionId = responderToRemove.id;
      await driveService.permissions.delete({
        fileId: formId,
        permissionId: permissionId,
      });
      console.log(`Responder with permission ID '${
        permissionId}' removed successfully.`);
    } else {
      console.log('Responder not found for the specified form');
    }
  } catch (err) {
    console.error('Error removing responder:', err);
  }
}

// [END forms_remove_responder]

export {removeResponders};
