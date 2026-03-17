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

// [START apps_script_api_execute]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Calls an Apps Script function to list the folders in the user's root Drive folder.
 */
async function callAppsScript() {
  // The ID of the Apps Script project to call.
  const scriptId = '1xGOh6wCm7hlIVSVPKm0y_dL-YqetspS5DEVmMzaxd_6AAvI-_u8DSgBT';

  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Apps Script API client.
  const script = google.script({version: 'v1', auth});

  const resp = await script.scripts.run({
    auth,
    requestBody: {
      // The name of the function to call in the Apps Script project.
      function: 'getFoldersUnderRoot',
    },
    scriptId,
  });

  if (resp.data.error?.details?.[0]) {
    // The API executed, but the script returned an error.
    // Extract the error details.
    const error = resp.data.error.details[0];
    console.log(`Script error message: ${error.errorMessage}`);
    console.log('Script error stacktrace:');

    if (error.scriptStackTraceElements) {
      // Log the stack trace.
      for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
        const trace = error.scriptStackTraceElements[i];
        console.log('\t%s: %s', trace.function, trace.lineNumber);
      }
    }
  } else {
    // The script executed successfully.
    // The structure of the response depends on the Apps Script function's return value.
    const folderSet = resp.data.response ?? {};
    if (Object.keys(folderSet).length === 0) {
      console.log('No folders returned!');
    } else {
      console.log('Folders under your root folder:');
      Object.keys(folderSet).forEach((id) => {
        console.log('\t%s (%s)', folderSet[id], id);
      });
    }
  }
}
// [END apps_script_api_execute]

callAppsScript();
