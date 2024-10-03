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

// [START chat_update_message_app_cred]

import {createClientWithAppCredentials} from './authentication-utils.js';

// This sample shows how to update a message with app credential
async function main() {
  // Create a client
  const chatClient = createClientWithAppCredentials();

  // Initialize request argument(s)
  const request = {
    message: {
      // Replace SPACE_NAME and MESSAGE_NAME here
      name: 'spaces/SPACE_NAME/messages/MESSAGE_NAME',
      text: 'Text updated with app credential!',
      cardsV2 : [{ card: { header: {
        title: 'Card updated with app credential!',
        imageUrl: 'https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/info/default/24px.svg'
      }}}]
    },
    // The field paths to update. Separate multiple values with commas or use
    // `*` to update all field paths.
    updateMask: {
      // The field paths to update.
      paths: ['text', 'cards_v2']
    }
  };

  // Make the request
  const response = await chatClient.updateMessage(request);

  // Handle the response
  console.log(response);
}

main().catch(console.error);

// [END chat_update_message_app_cred]
