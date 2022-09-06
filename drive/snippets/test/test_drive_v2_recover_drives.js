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

const {expect} = require('expect');
const Helpers = require('./helpers');
const recoverDrives = require('../drive_v2/drive_snippets/recover_drives');
const createDrive = require('../drive_v2/drive_snippets/create_drive');

describe('Drive snippets', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  // Note, you must enable creating Team Drives for your service account.
  // https://support.google.com/a/answer/7337635?hl=en
  it('should recover team drives', async () => {
    await createOrphanedTeamDrive();
    const teamDrives = await recoverDrives('soheil@workspacesamples.dev');
    expect(teamDrives.length).toBeDefined();
  });

  /**
   * Creates a standalone Team Drive.
   * @return {fileId} The id of the new Team Drive.
   */
  async function createOrphanedTeamDrive() {
    const fileId = await createDrive();
    const res = await helpers.service.permissions.list({
      fileId,
      supportsTeamDrives: true,
    });
    // console.log(res);
    res.data.permissions.forEach((permission) => {
      helpers.service.permissions.delete({
        fileId,
        permissionId: permission.id,
        supportsTeamDrives: true,
      });
    });
    return fileId;
  }
});
