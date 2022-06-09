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
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/script.projects'});
/**
 * Creates a new script project, upload a file, and log the script's URL.
 *
 * @param {Googleauth} auth The Google default authenticated
 */
function callAppsScript(auth) {
  const script = google.script({version: 'v1', auth});
  script.projects.create({
    resource: {
      title: 'My Script',
    },
  }, (err, res) => {
    if (err) return console.log(`The API create method returned an error: ${err}`);
    script.projects.updateContent({
      scriptId: res.data.scriptId,
      auth,
      resource: {
        files: [{
          name: 'hello',
          type: 'SERVER_JS',
          source: 'function helloWorld() {\n  console.log("Hello, world!");\n}',
        }, {
          name: 'appsscript',
          type: 'JSON',
          source: '{\"timeZone\":\"America/New_York\",\"exceptionLogging\":' +
           '\"CLOUD\"}',
        }],
      },
    }, {}, (err, res) => {
      if (err) return console.log(`The API updateContent method returned an error: ${err}`);
      console.log(`https://script.google.com/d/${res.data.scriptId}/edit`);
    });
  });
}
// [END apps_script_api_quickstart]

callAppsScript(auth);
