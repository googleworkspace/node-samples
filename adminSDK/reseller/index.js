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

// [START admin_sdk_reseller_quickstart]

import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/apps.order'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Lists the first 10 subscriptions you manage.
 */
async function listSubscriptions() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  const service = google.reseller({version: 'v1', auth});
  const result = await service.subscriptions.list({
    maxResults: 10,
  });
  const subscriptions = result.data.subscriptions;
  if (!subscriptions || subscriptions.length === 0) {
    console.log('No subscriptions found.');
    return;
  }

  console.log('Subscriptions:');
  subscriptions.forEach(({customerId, skuId, plan}) => {
    console.log(`${customerId} (${skuId}, ${plan?.planName})`);
  });
}

await listSubscriptions();

// [END admin_sdk_reseller_quickstart]
