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

// [START chat_get_message_app_cred]

import {createClientWithAppCredentials} from './authentication-utils.js';

// This sample shows how to get message with app credential
async function main() {
  // Create a client
  const chatClient = createClientWithAppCredentials();

  // Initialize request argument(s)
  const request = {
    // Replace SPACE_NAME and MESSAGE_NAME here
    name: 'spaces/SPACE_NAME/messages/MESSAGE_NAME'
  };

  // Make the request
  const response = await chatClient.getMessage(request);

  // Handle the response
  console.log(response);
}

main().catch(console.error);

// [END chat_get_message_app_cred]
