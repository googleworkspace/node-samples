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

// [START chat_create_reaction_user_cred]

import {createClientWithUserCredentials} from './authentication-utils.js';

const USER_AUTH_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/chat.messages.reactions.create',
];

// This sample shows how to create reaction to a message with user credential
async function main() {
  // Create a client
  const chatClient = await createClientWithUserCredentials(
      USER_AUTH_OAUTH_SCOPES,
  );

  // Initialize request argument(s)
  const request = {
    // Replace SPACE_NAME and MESSAGE_NAME here.
    parent: 'spaces/SPACE_NAME/messages/MESSAGE_NAME',
    reaction: {
      // A standard emoji represented by a unicode string.
      emoji: {unicode: '😀'},
    },
  };

  // Make the request
  const response = await chatClient.createReaction(request);

  // Handle the response
  console.log(response);
}

await main();

// [END chat_create_reaction_user_cred]
