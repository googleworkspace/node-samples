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
/**
 * Call an Apps Script function to list the folders in the user's root Drive
 * folder.
 *
 */
async function callAppsScript() {
  const scriptId = '1xGOh6wCm7hlIVSVPKm0y_dL-YqetspS5DEVmMzaxd_6AAvI-_u8DSgBT';

  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const script = google.script({version: 'v1', auth});

  try {
    // Make the API request. The request object is included here as 'resource'.
    const resp = await script.scripts.run({
      auth: auth,
      resource: {
        function: 'getFoldersUnderRoot',
      },
      scriptId: scriptId,
    });
    if (resp.error) {
      // The API executed, but the script returned an error.

      // Extract the first (and only) set of error details. The values of this
      // object are the script's 'errorMessage' and 'errorType', and an array
      // of stack trace elements.
      const error = resp.error.details[0];
      console.log('Script error message: ' + error.errorMessage);
      console.log('Script error stacktrace:');

      if (error.scriptStackTraceElements) {
        // There may not be a stacktrace if the script didn't start executing.
        for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
          const trace = error.scriptStackTraceElements[i];
          console.log('\t%s: %s', trace.function, trace.lineNumber);
        }
      }
    } else {
      // The structure of the result will depend upon what the Apps Script
      // function returns. Here, the function returns an Apps Script Object
      // with String keys and values, and so the result is treated as a
      // Node.js object (folderSet).
      const folderSet = resp.response.result;
      if (Object.keys(folderSet).length == 0) {
        console.log('No folders returned!');
      } else {
        console.log('Folders under your root folder:');
        Object.keys(folderSet).forEach(function(id) {
          console.log('\t%s (%s)', folderSet[id], id);
        });
      }
    }
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END apps_script_api_execute]

callAppsScript();
