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

// [START forms_get_responders]

import path from 'node:path';
import {authenticate} from '@google-cloud/local-auth';
import {drive} from '@googleapis/drive';

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

/**
 * Gets the responders of a form.
 * This is done by listing the permissions of the form in Google Drive.
 *
 * @param {string} formId The ID of the form.
 */
async function getResponders(formId) {
  // Authenticate with Google and get an authorized client.
  const authClient = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  // Create a new Drive API client.
  const driveService = drive({version: 'v3', auth: authClient});

  try {
    // List the permissions for the form.
    const result = await driveService.permissions.list({
      fileId: formId,
      includePermissionsForView: 'published',
      fields: 'permissions(id,emailAddress,type,role,view)',
    });

    const permissions = result.data.permissions || [];
    if (permissions.length === 0) {
      console.log(`No permissions found for form ID: ${formId}`);
    } else {
      console.log('Responders for this form:');
      // A responder is a permission with view='published' and role='reader'.
      for (const permission of permissions) {
        if (permission.view === 'published' && permission.role === 'reader') {
          console.log(`Responder:`, permission);
        }
      }
    }
  } catch (err) {
    console.error('Error getting responders :', err);
  }
}

// [END forms_get_responders]

export {getResponders};
