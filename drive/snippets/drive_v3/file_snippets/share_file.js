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
// [START drive_share_file]

/**
 * Batch permission modification
 * @param{string} realFileId file ID
 * @param{string} realUser username
 * @param{string} realDomain domain
 * @return{obj} permission id
 * */
function shareFile(fileId, realUser, realDomain) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');
  const async = require('async');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/drive'});
  const service = google.drive({version: 'v3', auth});

  let id;
  const permissions = [
    {
      'type': 'user',
      'role': 'writer',
      'emailAddress': 'user@example.com',
    }, {
      'type': 'domain',
      'role': 'writer',
      'domain': 'example.com',
    },
  ];
  permissions[0].emailaddress = realUser;
  permissions[1].domain = realDomain;
  // Using the NPM module 'async'
  try {
    async.eachSeries(permissions, function(permission) {
      service.permissions.create({
        resource: permission,
        fileId: fileId,
        fields: 'id',
      }).then(function(result) {
        id = result.data.id;
        console.log('Permission Id:', id);
      });
    });
    return id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END drive_share_file]

shareFile('1h9BsKrrEup5h2xOo5OzR70vSQpixjZfw', 'xyz@workspacesamples.dev',
    'workspacesamples.dev');
