/**
 * @license
 * Copyright Google Inc.
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
/**
 * Lists the last 10 login events for the domain.
 */
async function listLoginEvents() {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({scopes:
        'https://www.googleapis.com/auth/admin.reports.usage.readonly'});
  const service = google.admin({version: 'reports_v1', auth});
  try {
    const res = await service.activities.list({
      userKey: 'all',
      applicationName: 'login',
      maxResults: 10,
    });

    const activities = res.data.items;
    if (activities.length) {
      console.log('Logins:');
      activities.forEach((activity) => {
        console.log(`${activity.id.time}: ${activity.actor.email} (${activity.events[0].name})`);
      });
    } else {
      console.log('No logins found.');
    }
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END admin_sdk_reports_quickstart]

listLoginEvents();
