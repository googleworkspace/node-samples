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

// [START chat_list_space_events_user_cred]

import {createClientWithUserCredentials} from './authentication-utils.js';

// Authorization scopes based on the event types
const USER_AUTH_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/chat.memberships.readonly',
  'https://www.googleapis.com/auth/chat.messages.readonly'
];

// This sample shows how to list space events with user credential
async function main() {
  // Create a client
  const chatClient = await createClientWithUserCredentials(USER_AUTH_OAUTH_SCOPES);

  // Initialize request argument(s)
  const request = {
    // Replace SPACE_NAME here
    parent: 'spaces/SPACE_NAME',
    // A required filter. Filters events about new memberships and messages
    filter: 'eventTypes:"google.workspace.chat.membership.v1.created" OR eventTypes:"google.workspace.chat.message.v1.created"'
  };

  // Make the request
  const pageResult = chatClient.listSpaceEventsAsync(request);

  // Handle the response. Iterating over pageResult will yield results and
  // resolve additional pages automatically.
  for await (const response of pageResult) {
    console.log(response);
  }
}

main().catch(console.error);

// [END chat_list_space_events_user_cred]
