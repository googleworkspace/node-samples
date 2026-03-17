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

// [START apps_script_api_quickstart]

import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/script.projects'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Creates a new script project, upload a file, and log the script's URL.
 */
async function callAppsScript() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  const script = google.script({version: 'v1', auth});
  const project = await script.projects.create({
    requestBody: {
      title: 'My Script',
    },
  });

  if (!project.data.scriptId) {
    throw new Error('Failed to create project');
  }

  await script.projects.updateContent({
    scriptId: project.data.scriptId,
    auth,
    requestBody: {
      files: [
        {
          name: 'hello',
          type: 'SERVER_JS',
          source: 'function helloWorld() {\n  console.log("Hello, world!");\n}',
        },
        {
          name: 'appsscript',
          type: 'JSON',
          source:
            '{"timeZone":"America/New_York","exceptionLogging":' + '"CLOUD"}',
        },
      ],
    },
  });
  console.log(`https://script.google.com/d/${project.data.scriptId}/edit`);
}

await callAppsScript();
// [END apps_script_api_quickstart]
