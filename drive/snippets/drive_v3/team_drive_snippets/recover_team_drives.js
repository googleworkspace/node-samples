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
// [START drive_recover_team_drives]

/**
 * Find all shared team drives without an organizer and add one.
 * @param{string} userId user ID
 * @return{obj} page token
 * */
async function recoverTeamDrives(userId) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/drive'});
  const service = google.drive({version: 'v3', auth});
  const teamDrives = [];
  const newOrganizerPermission = {
    type: 'user',
    role: 'organizer',
    value: 'user@example.com',
  };
  newOrganizerPermission.value = userId;

  let pageToken = null;
  try {
    const res = await service.teamdrives.list({
      q: 'organizerCount = 0',
      fields: 'nextPageToken, teamDrives(id, name)',
      useDomainAdminAccess: true,
      pageToken: pageToken,
    });
    Array.prototype.push.apply(teamDrives, res.data.teamDrives);
    res.data.teamDrives.forEach(function(teamDrive) {
      console.log('Found shared drive without organizer:', teamDrive.name, teamDrive.id);
      drive.permissions.create({
        resource: newOrganizerPermission,
        fileId: teamDrive.id,
        useDomainAdminAccess: true,
        supportsAllDrives: true,
        fields: 'id',
      });
    });
    pageToken = res.nextPageToken;
    return !!pageToken;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// [END drive_recover_team_drives]

recoverTeamDrives('axyz@workspacesamples.dev');
