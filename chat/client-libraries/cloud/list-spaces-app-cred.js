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

// [START chat_list_spaces_app_cred]

import {createClientWithAppCredentials} from './authentication-utils.js';

// This sample shows how to list spaces with app credential
async function main() {
  // Create a client
  const chatClient = createClientWithAppCredentials();

  // Initialize request argument(s)
  const request = {
    // Filter spaces by space type (SPACE or GROUP_CHAT or DIRECT_MESSAGE)
    filter: 'space_type = "SPACE"'
  };

  // Make the request
  const pageResult = chatClient.listSpacesAsync(request);

  // Handle the response. Iterating over pageResult will yield results and
  // resolve additional pages automatically.
  for await (const response of pageResult) {
    console.log(response);
  }
}

main().catch(console.error);

// [END chat_list_spaces_app_cred]
