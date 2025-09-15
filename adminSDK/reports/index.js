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

// [START admin_sdk_reports_quickstart]

import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/admin.reports.audit.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Lists the last 10 login events for the domain.
 */
async function listLoginEvents() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  const service = google.admin({version: 'reports_v1', auth});
  const result = await service.activities.list({
    userKey: 'all',
    applicationName: 'login',
    maxResults: 10,
  });
  const activities = result.data.items;
  if (!activities || activities.length === 0) {
    console.log('No logins found.');
    return;
  }

  console.log('Logins:');
  activities.forEach((activity) => {
    console.log(
      `${activity.id?.time}: ${activity.actor?.email} (${activity.events?.[0]?.name})`,
    );
  });
}

await listLoginEvents();
// [END admin_sdk_reports_quickstart]
