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
// [START drive_fetch_appdata_folder]
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/drive.appdata'});
/**
 * List out application data folder and prints folder ID
 * @param {Googleauth} auth The Google default authenticated .
 * */
function fetch_appdata_folder(auth) {
    const service = google.drive({version: 'v2', auth});
    service.files.get({
        fileId: 'appDataFolder',
        fields: 'id',
    }, function(err, file) {
        if (err) {
            // Handle error
            console.error('The API returned an error: ' + err);
        } else {
            console.log('File Id:', file.data.id);
        }
    });
}
// [END drive_fetch_appdata_folder]

fetch_appdata_folder(auth);
