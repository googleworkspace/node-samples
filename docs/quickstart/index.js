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

// [START docs_quickstart]

import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

// The scope for reading Google Docs.
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 */
async function printDocTitle() {
  // Authenticate with Google and get an authorized client.
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  // Create a new Docs API client.
  const docs = google.docs({version: 'v1', auth});
  // Get the document.
  const result = await docs.documents.get({
    documentId: '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE',
  });
  // Print the title of the document.
  console.log(`The title of the document is: ${result.data.title}`);
}

await printDocTitle();

// [END docs_quickstart]
