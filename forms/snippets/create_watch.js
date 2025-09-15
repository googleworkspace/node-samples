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

// [START forms_create_watch]

import path from 'node:path';
import {authenticate} from '@google-cloud/local-auth';
import {forms} from '@googleapis/forms';

// TODO: Replace with a valid form ID.
const formID = '<YOUR_FORM_ID>';

/**
 * Creates a watch on a form to get notifications for new responses.
 */
async function createWatch() {
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

  // The request body to create a watch.
  const watchRequest = {
    watch: {
      target: {
        topic: {
          // TODO: Replace with a valid Cloud Pub/Sub topic name.
          topicName: 'projects/<YOUR_TOPIC_PATH>',
        },
      },
      // The event type to watch for. 'RESPONSES' is the only supported type.
      eventType: 'RESPONSES',
    },
  };

  // Send the request to create the watch.
  const result = await formsClient.forms.watches.create({
    formId: formID,
    requestBody: watchRequest,
  });

  console.log(result.data);
  return result.data;
}

// [END forms_create_watch]

export {createWatch};
