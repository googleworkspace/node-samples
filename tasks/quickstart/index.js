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
// [START tasks_quickstart]
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/tasks.readonly'});

/**
 * Lists the user's first 10 task lists.
 *
 * @param {Googleauth} auth The Google default authenticated
 */
function listTaskLists(auth) {
  const service = google.tasks({version: 'v1', auth});
  service.tasklists.list({
    maxResults: 10,
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const taskLists = res.data.items;
    if (taskLists) {
      console.log('Task lists:');
      taskLists.forEach((taskList) => {
        console.log(`${taskList.title} (${taskList.id})`);
      });
    } else {
      console.log('No task lists found.');
    }
  });
}
// [END tasks_quickstart]

listTaskLists(auth);
