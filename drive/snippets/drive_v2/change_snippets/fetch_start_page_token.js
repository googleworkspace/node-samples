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
// [START drive_fetch_start_page_token]
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/drive'});
/**
 * Retrieve page token for the current state of the account
 * @param {Googleauth} auth The Google default authenticated .
 * */
function fetch_start_page_token(auth) {
    const service = google.drive({version: 'v2', auth});
    service.changes.getStartPageToken({},
        function(err, res) {
            if (err) {
                console.error('The API returned an error: ' + err);
                } else {
                    console.log('Start token:', res.data.startPageToken);
                }
        });
}
// [END drive_fetch_start_page_token]

fetch_start_page_token(auth);
