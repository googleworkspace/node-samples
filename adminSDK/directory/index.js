/**
 * Copyright 2022 Google LLC
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

// [START admin_sdk_directory_quickstart]

import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

// The scope for the Admin SDK Directory API.
const SCOPES = ['https://www.googleapis.com/auth/admin.directory.user'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Lists the first 10 users in the domain.
 */
async function listUsers() {
  // Authenticate with Google and get an authorized client.
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  // Create a new Admin SDK Directory API client.
  const service = google.admin({version: 'directory_v1', auth});
  // Get the list of users.
  const result = await service.users.list({
    customer: 'my_customer',
    maxResults: 10,
    orderBy: 'email',
  });

  const users = result.data.users;
  if (!users || users.length === 0) {
    console.log('No users found.');
    return;
  }

  // Print the primary email and full name of each user.
  console.log('Users:');
  users.forEach((user) => {
    console.log(`${user.primaryEmail} (${user.name?.fullName})`);
  });
}

await listUsers();

// [END admin_sdk_directory_quickstart]
