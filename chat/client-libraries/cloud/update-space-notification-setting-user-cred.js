/**
 * Copyright 2025 Google LLC
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

// [START chat_update_space_notification_setting_user_cred]

import {createClientWithUserCredentials} from './authentication-utils.js';

const USER_AUTH_OAUTH_SCOPES = ['https://www.googleapis.com/auth/chat.users.spacesettings'];

// This sample shows how to update the space notification setting for the calling user
async function main() {
  // Create a client
  const chatClient = await createClientWithUserCredentials(USER_AUTH_OAUTH_SCOPES);

  // Initialize request argument(s), replace the SPACE_NAME with an actual space name.
  const request = {
    spaceNotificationSetting : {
    	name : 'users/me/spaces/SPACE_NAME/spaceNotificationSetting',
    	notificationSetting : 'ALL',
    	muteSetting : 'UNMUTED'
    },
    updateMask : { paths: ['notification_setting','mute_setting']}
  };

  // Make the request
  const response = await chatClient.updateSpaceNotificationSetting(request);

  // Handle the response
  console.log(response);
}

main().catch(console.error);

// [END chat_update_space_notification_setting_user_cred]