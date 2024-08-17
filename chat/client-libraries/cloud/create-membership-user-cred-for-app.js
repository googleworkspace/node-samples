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

// [START chat_create_membership_user_cred_for_app]

import {createClientWithUserCredentials} from './authentication-utils.js';

const USER_AUTH_OAUTH_SCOPES = ['https://www.googleapis.com/auth/chat.memberships.app'];

// This sample shows how to create membership with app credential for an app
async function main() {
  // Create a client
  const chatClient = await createClientWithUserCredentials(USER_AUTH_OAUTH_SCOPES);

  // Initialize request argument(s)
  const request = {
    // Replace SPACE_NAME here.
    parent: 'spaces/SPACE_NAME',
    membership: {
      member: {
        // Member name for app membership, do not change this
        name: 'users/app',
        // User type for the membership
        type: 'BOT'
      }
    }
  };

  // Make the request
  const response = await chatClient.createMembership(request);

  // Handle the response
  console.log(response);
}

main().catch(console.error);

// [END chat_create_membership_user_cred_for_app]
