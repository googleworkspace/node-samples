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
// [START forms_add_responder]
'use strict';

import path from 'path';
import {drive} from '@googleapis/drive';
import {authenticate} from '@google-cloud/local-auth';

// TODO: Replace with your form ID (fileId) and responder's email
const YOUR_FORM_ID = 'YOUR_FORM_ID';
const YOUR_RESPONDER_EMAIL = 'user@example.com';

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

/**
 * Adds a responder to the form.
 *
 * @param {string} formId The ID of the form.
 * @param {string} email The email of the responder.
 */
async function runSample(formId, email) {
  if (!formId || !email) {
    console.log('Form ID and responder email are required.');
    return;
  }
  const authClient = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  const driveService = drive({version: 'v3', auth: authClient});

  const permissionBody = {
    role: 'reader',
    type: 'user',
    emailAddress: email,
    view: 'published',
  };

  try {
    const res = await driveService.permissions.create({
      fileId: formId,
      requestBody: permissionBody,
      fields: 'id,emailAddress,role,type,view',
      sendNotificationEmail: false, // Optional
    });
    console.log('Responder added:', res.data);
  } catch (err) {
    console.error('Error adding responder:', err);
  }
}

if (import.meta.url === `file://${process.argv}`) {
  runSample(YOUR_FORM_ID, YOUR_RESPONDER_EMAIL).catch(console.error);
}
// [END forms_add_responder]

export {runSample};
