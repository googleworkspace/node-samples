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
// [START drive_create_team_drive]

/**
 * create a drive
 * @return{obj} drive Id
 * */
async function createTeamDrive() {
  const uuid = require('uuid');
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/drive'});
  const service = google.drive({version: 'v2', auth});
  const teamDriveMetadata = {
    'name': 'Project resources',
  };
  const requestId = uuid.v4();
  try {
    const teamDrive= await service.teamdrives.insert({
      resource: teamDriveMetadata,
      requestId: requestId,
      fields: 'id',
    });
    console.log('Team Drive Id:', teamDrive.data.id);
    return teamDrive.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END drive_create_team_drive]

createTeamDrive();

