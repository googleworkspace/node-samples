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

// [START forms_supports_publishing]

import path from 'node:path';
import {authenticate} from '@google-cloud/local-auth';
import {forms} from '@googleapis/forms';

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = 'https://www.googleapis.com/auth/forms.body';

/**
 * Checks if a form supports the `publishSettings` field, which indicates it is not a legacy form.
 *
 * @param {string} formIdToCheck The ID of the form to check.
 */
async function supportsPublishing(formIdToCheck) {
  // Authenticate with Google and get an authorized client.
  const authClient = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  // Create a new Forms API client.
  const formsClient = forms({
    version: 'v1',
    auth: authClient,
  });

  try {
    // Get the form metadata.
    const result = await formsClient.forms.get({
      formId: formIdToCheck,
    });

    const formTitle = result.data.info?.title;

    // If the 'publishSettings' field exists (even if empty), the form supports the new
    // publishing model and is not a legacy form.
    if (result.data && result.data.publishSettings !== undefined) {
      console.log(
        `Form '${formIdToCheck}' (Title: ${
          formTitle
        }) is NOT a legacy form (supports publishSettings).`,
      );
    } else {
      console.log(
        `Form '${formIdToCheck}' (Title: ${
          formTitle
        }) IS a legacy form (does not have publishSettings field).`,
      );
    }
  } catch (err) {
    console.error(`Error getting form metadata for '${formIdToCheck}':`, err);
  }
}

// [END forms_supports_publishing]

export {supportsPublishing};
