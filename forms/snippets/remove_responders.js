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
//
// [START forms_remove_responder]
'use strict';

const path = require('path');
const {drive} = require('@googleapis/drive');
const {authenticate} = require('@google-cloud/local-auth');

// TODO: Replace with your form ID (fileId) and responder's email
const YOUR_FORM_ID = 'YOUR_FORM_ID';
const YOUR_RESPONDER_EMAIL = 'responder-to-remove@example.com';

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

/**
 * Remove a responder to the form.
 *
 * @param {string} formId The ID of the form.
 * @param {string} email The email of the responder.
 */
async function runSample(formId, email) {
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

if (module === require.main) {
  runSample(YOUR_FORM_ID, YOUR_RESPONDER_EMAIL).catch(console.error);
}
module.exports = runSample;
// [END forms_remove_responder]