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
// [START admin_sdk_reseller_quickstart]

/**
 * Lists the first 10 subscriptions you manage.
 */
async function listSubscriptions() {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/apps.order'});
  const service = google.reseller({version: 'v1', auth});
  try {
    const res = await service.subscriptions.list({
      maxResults: 10,
    });
    const subscriptions = res.data.subscriptions;
    if (subscriptions.length) {
      console.log('Subscriptions:');
      subscriptions.forEach(({customerId, skuId, plan}) => {
        console.log(`${customerId} (${skuId}, ${plan.planName})`);
      });
    } else {
      console.log('No subscriptions found.');
    }
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END admin_sdk_reseller_quickstart]

listSubscriptions();
