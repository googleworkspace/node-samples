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

// [START drive_activity_v2_quickstart]

import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

// The scope for reading Drive activity.
const SCOPES = ['https://www.googleapis.com/auth/drive.activity.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Lists the recent activity in your Google Drive.
 */
async function listDriveActivity() {
  // Authenticate with Google and get an authorized client.
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  // Create a new Drive Activity API client.
  const service = google.driveactivity({version: 'v2', auth});

  // The parameters for the activity query.
  const params = {
    pageSize: 10,
  };

  // Query for recent activity.
  const result = await service.activity.query({requestBody: params});
  const activities = result.data.activities;
  if (!activities || activities.length === 0) {
    console.log('No activity.');
    return;
  }
  console.log('Recent activity:');
  // Print the recent activity.
  console.log(JSON.stringify(activities, null, 2));
}

await listDriveActivity();

// [END drive_activity_v2_quickstart]
