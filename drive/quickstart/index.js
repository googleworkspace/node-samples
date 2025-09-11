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

// [START drive_quickstart]

import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Lists the names and IDs of up to 10 files.
 */
async function listFiles() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  const drive = google.drive({version: 'v3', auth});
  const result = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  const files = result.data.files;
  if (!files) {
    console.log('No files found.');
    return;
  }

  console.log('Files:');
  files.forEach((file) => {
    console.log(`${file.name} (${file.id})`);
  });
}

await listFiles();
// [END drive_quickstart]
