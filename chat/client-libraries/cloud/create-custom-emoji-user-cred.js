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

// [START chat_create_custom_emoji_user_cred]

import {createClientWithUserCredentials} from './authentication-utils.js';

const USER_AUTH_OAUTH_SCOPES = ['https://www.googleapis.com/auth/chat.customemojis'];

// This sample shows how to create custom emoji with user credential
async function main() {
  // Create a client
  const chatClient = await createClientWithUserCredentials(USER_AUTH_OAUTH_SCOPES);

  // Initialize request argument(s)
  const request = {
    custom_emoji: {
      // Replace EMOJI_NAME here.
      emoji_name: ":EMOJI_NAME:",
      payload: {
        // Replace FILE_CONTENT here.
        file_content: "FILE_CONTENT",
        // Replace FILENAME here.
        filename: "FILENAME",
      }
    }
  };

  // Make the request
  const response = await chatClient.createCustomEmoji(request);

  // Handle the response
  console.log(response);
}

main().catch(console.error);

// [END chat_create_custom_emoji_user_cred]
