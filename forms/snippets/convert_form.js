// Copyright 2022 Google LLC
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

// [START forms_convert_form]

import path from 'node:path';
import {authenticate} from '@google-cloud/local-auth';
import {forms} from '@googleapis/forms';

/**
 * Creates a new form and then converts it into a quiz.
 */
async function convertForm() {
  // Authenticate with Google and get an authorized client.
  const authClient = await authenticate({
    keyfilePath: path.join(__dirname, 'credentials.json'),
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Forms API client.
  const formsClient = forms({
    version: 'v1',
    auth: authClient,
  });

  // The initial form to be created.
  const newForm = {
    info: {
      title: 'Creating a new form for batchUpdate in Node',
    },
  };

  // Create the new form.
  const createResponse = await formsClient.forms.create({
    requestBody: newForm,
  });

  if (!createResponse.data.formId) {
    throw new Error('Failed to create form.');
  }

  console.log(`New formId was: ${createResponse.data.formId}`);

  // Request body to convert the form to a quiz.
  const updateRequest = {
    requests: [
      {
        updateSettings: {
          settings: {
            quizSettings: {
              isQuiz: true,
            },
          },
          // The updateMask specifies which fields to update.
          updateMask: 'quizSettings.isQuiz',
        },
      },
    ],
  };

  // Send the batch update request to convert the form to a quiz.
  const result = await formsClient.forms.batchUpdate({
    formId: createResponse.data.formId,
    requestBody: updateRequest,
  });

  console.log(result.data);
  return result.data;
}

// [END forms_convert_form]

export {convertForm};
