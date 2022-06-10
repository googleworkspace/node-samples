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
// [START admin_sdk_directory_quickstart]
/**
 * Lists the first 10 users in the domain,
 */
async function listUsers() {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/admin.directory.customer'});
  const service = google.admin({version: 'directory_v1', auth});
  try {
    const res = await service.users.list({
      customer: 'my_customer',
      maxResults: 10,
      orderBy: 'email',
    });
    const users = res.data.users;
    if (users.length) {
      console.log('Users:');
      users.forEach((user) => {
        console.log(`${user.primaryEmail} (${user.name.fullName})`);
      });
    } else {
      console.log('No users found.');
    }
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END admin_sdk_directory_quickstart]

listUsers();
