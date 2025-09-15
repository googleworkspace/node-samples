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

// [START chat_quickstart]

import path from 'node:path';
import process from 'node:process';
import {ChatServiceClient} from '@google-apps/chat';
import {authenticate} from '@google-cloud/local-auth';

// The scope for reading Chat spaces.
const SCOPES = ['https://www.googleapis.com/auth/chat.spaces.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Lists the spaces that the user is a member of.
 */
async function listSpaces() {
  // Authenticate with Google and get an authorized client.
  const authClient = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  // Create a new Chat API client.
  const chatClient = new ChatServiceClient({
    authClient,
    scopes: SCOPES,
  });

  // The request to list spaces.
  const request = {
    // Filter spaces by type. In this case, we are only interested in "SPACE" type.
    filter: 'space_type = "SPACE"',
  };

  // Make the API request.
  const pageResult = chatClient.listSpacesAsync(request);

  // Process the response.
  // The `pageResult` is an async iterable that will yield each space.
  for await (const response of pageResult) {
    console.log(response);
  }
}

await listSpaces();

// [END chat_quickstart]
