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

// [START meet_quickstart]

import path from 'node:path';
import process from 'node:process';
import {SpacesServiceClient} from '@google-apps/meet';
import {authenticate} from '@google-cloud/local-auth';

const SCOPES = ['https://www.googleapis.com/auth/meetings.space.created'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Creates a new meeting space.
 */
async function createSpace() {
  const authClient = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  const meetClient = new SpacesServiceClient({
    authClient,
  });
  // Construct request
  const request = {};

  // Run request
  const response = await meetClient.createSpace(request);
  console.log(`Meet URL: ${response[0].meetingUri}`);
}

await createSpace();
// [END meet_quickstart]
