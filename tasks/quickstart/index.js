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

import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

// The scope for reading tasks.
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Lists the user's first 10 task lists.
 */
async function listTaskLists() {
  // Authenticate with Google and get an authorized client.
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  // Create a new Tasks API client.
  const service = google.tasks({version: 'v1', auth});
  // Get the list of task lists.
  const result = await service.tasklists.list({
    maxResults: 10,
  });
  const taskLists = result.data.items;
  if (taskLists?.length) {
    console.log('Task lists:');
    // Print the title and ID of each task list.
    taskLists.forEach((taskList) => {
      console.log(`${taskList.title} (${taskList.id})`);
    });
  } else {
    console.log('No task lists found.');
  }
}

await listTaskLists();

// [END tasks_quickstart]
