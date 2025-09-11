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

// [START forms_stop_accepting_responses]

import path from 'node:path';
import {authenticate} from '@google-cloud/local-auth';
import {forms} from '@googleapis/forms';

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = 'https://www.googleapis.com/auth/forms.body';

/**
 * Stops accepting responses to the form.
 *
 * @param {string} formId The ID of the form.
 */
async function stopAcceptingResponses(formId) {
  const authClient = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  const formsClient = forms({
    version: 'v1',
    auth: authClient,
  });

  const setPublishSettingsRequest = {
    publishSettings: {
      publishState: {
        isPublished: true, // Keep it published (or ensure it is if it wasn't)
        isAcceptingResponses: false, // Stop accepting responses
      },
    },
  };

  try {
    const res = await formsClient.forms.setPublishSettings({
      formId,
      requestBody: setPublishSettingsRequest,
    });
    console.log('Form is no longer accepting responses.', res.data);
  } catch (err) {
    console.error('Error setting publish settings:', err);
  }
}

// [END forms_stop_accepting_responses]

export {stopAcceptingResponses};
