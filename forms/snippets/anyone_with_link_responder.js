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

// [START forms_is_anyone_with_link_responder_js]

import path from 'node:path';
import {authenticate} from '@google-cloud/local-auth';
import {drive} from '@googleapis/drive';

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

/**
 * Checks if anyone with the link is a responder for the form.
 *
 * @param {string} formId The ID of the Google Form.
 */
async function isAnyoneWithLinkResponder(formId) {
  const authClient = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  const driveService = drive({version: 'v3', auth: authClient});
  let anyoneWithLinkResponder = false;

  try {
    const result = await driveService.permissions.list({
      fileId: formId,
      fields: 'permissions(id,type,role,view)',
      includePermissionsForView: 'published',
    });

    const permissions = result.data.permissions || [];
    if (permissions.length === 0) {
      console.log(`No permissions found for form ID: ${formId}`);
    } else {
      for (const permission of permissions) {
        if (
          permission.type === 'anyone' &&
          permission.view === 'published' &&
          permission.role === 'reader'
        ) {
          anyoneWithLinkResponder = true;
          break;
        }
      }
    }

    if (anyoneWithLinkResponder) {
      console.log(
        `Form '${formId}' IS configured for 'Anyone with the link' to respond.`,
      );
    } else {
      console.log(
        `Form '${formId}' is NOT configured for 'Anyone with the link' to respond.`,
      );
    }
  } catch (e) {
    console.error(`Error checking "anyone with link" permission: ${e}`);
  }
}
// [END forms_is_anyone_with_link_responder_js]

// [START forms_set_anyone_with_link_responder_js]
/**
 * Sets anyone with the link to be a responder for the form.
 *
 * @param {string} formId The ID of the Google Form.
 */
async function setAnyoneWithLinkResponder(formId) {
  const authClient = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  const driveService = drive({version: 'v3', auth: authClient});

  const permissionBody = {
    type: 'anyone',
    view: 'published', // Key for making it a responder setting
    role: 'reader',
  };

  try {
    const result = await driveService.permissions.create({
      fileId: formId,
      requestBody: permissionBody,
      fields: 'id', // Request only needed fields
    });
    console.log(
      `'Anyone with the link can respond' permission set for form '${formId}'.` +
        ` Permission ID: ${result.data.id}`,
    );
  } catch (e) {
    console.error(`Error setting "anyone with link" permission: ${e}`);
  }
}
// [END forms_set_anyone_with_link_responder_js]

// [START forms_remove_anyone_with_link_responder_js]
/**
 * Removes anyone with the link as a responder for the form.
 *
 * @param {string} formId The ID of the Google Form.
 */
async function removeAnyoneWithLinkResponder(formId) {
  const authClient = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  const driveService = drive({version: 'v3', auth: authClient});
  let permissionIdToDelete = null;

  try {
    const result = await driveService.permissions.list({
      fileId: formId,
      fields: 'permissions(id,type,role,view)',
      includePermissionsForView: 'published',
    });

    const permissions = result.data.permissions || [];
    for (const permission of permissions) {
      if (
        permission.type === 'anyone' &&
        permission.role === 'reader' &&
        permission.view === 'published'
      ) {
        permissionIdToDelete = permission.id;
        break;
      }
    }

    if (permissionIdToDelete) {
      await driveService.permissions.delete({
        fileId: formId,
        permissionId: permissionIdToDelete,
      });
      console.log(
        `Successfully removed permission (ID: ${permissionIdToDelete})` +
          ` from form '${formId}'.`,
      );
    } else {
      console.log(`Permission not found for form '${formId}'.`);
    }
  } catch (e) {
    console.error(`Error removing "anyone with link" permission: ${e}`);
  }
}
// [END forms_remove_anyone_with_link_responder_js]

export {
  isAnyoneWithLinkResponder,
  setAnyoneWithLinkResponder,
  removeAnyoneWithLinkResponder,
};
