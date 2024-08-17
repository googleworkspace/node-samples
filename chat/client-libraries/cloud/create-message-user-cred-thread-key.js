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

// [START chat_create_message_user_cred_thread_key]

import {createClientWithUserCredentials} from './authentication-utils.js';
const {MessageReplyOption} = require('@google-apps/chat').protos.google.chat.v1.CreateMessageRequest;

const USER_AUTH_OAUTH_SCOPES = ['https://www.googleapis.com/auth/chat.messages.create'];

// This sample shows how to create message with user credential with thread key
async function main() {
  // Create a client
  const chatClient = await createClientWithUserCredentials(USER_AUTH_OAUTH_SCOPES);

  // Initialize request argument(s)
  const request = {
    // Replace SPACE_NAME here.
    parent: 'spaces/SPACE_NAME',
    // Creates the message as a reply to the thread specified by thread_key
    // If it fails, the message starts a new thread instead
    messageReplyOption: MessageReplyOption.REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD,
    message: {
      text: 'Hello with user credential!',
      thread: {
        // Thread key specifies a thread and is unique to the chat app
        // that sets it
        threadKey: 'THREAD_KEY'
      }
    }
  };

  // Make the request
  const response = await chatClient.createMessage(request);

  // Handle the response
  console.log(response);
}

main().catch(console.error);

// [END chat_create_message_user_cred_thread_key]
