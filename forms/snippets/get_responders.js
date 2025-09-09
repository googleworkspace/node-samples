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
// [START forms_get_responders]
'use strict';

import path from 'path';
import {drive} from '@googleapis/drive';
import {authenticate} from '@google-cloud/local-auth';

// TODO: Replace with your form ID
const YOUR_FORM_ID = 'YOUR_FORM_ID';

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

/**
 * Gets the responders to the form.
 *
 * @param {string} formId The ID of the form.
 */
async function runSample(formId) {
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
    if (permissions.length === 0) {
      console.log(`No permissions found for form ID: ${formId}`);
    } else {
      console.log('Responders for this form:');
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

if (import.meta.url === `file://${process.argv}`) {
  runSample(YOUR_FORM_ID).catch(console.error);
}
// [END forms_get_responders]

export {runSample};
