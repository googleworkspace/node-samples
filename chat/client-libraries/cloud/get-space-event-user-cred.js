/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// It may require modifications to work in your environment.

// [START chat_get_space_event_user_cred]

import {createClientWithUserCredentials} from './authentication-utils.js';

// Replace SCOPE_NAME here with an authorization scope based on the event type
const USER_AUTH_OAUTH_SCOPES = ['SCOPE_NAME'];

// This sample shows how to get space event with user credential
async function main() {
  // Create a client
  const chatClient = await createClientWithUserCredentials(USER_AUTH_OAUTH_SCOPES);

  // Initialize request argument(s)
  const request = {
    // Replace SPACE_NAME and SPACE_EVENT_NAME here
    name: 'spaces/SPACE_NAME/spaceEvents/SPACE_EVENT_NAME'
  };

  // Make the request
  const response = await chatClient.getSpaceEvent(request);

  // Handle the response
  console.log(response);
}

main().catch(console.error);

// [END chat_get_space_event_user_cred]
