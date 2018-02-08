/**
 * @license
 * Copyright Google Inc.
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
const Promise = require('promise');
const expect = require('expect');
const Helpers = require('./helpers');
const DriveSnippets = require('../snippets');

const mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(done, (err) => {
      done(err);
    });
  };
};

describe('Drive snippets', () => {
  const helpers = new Helpers();
  let snippets;

  before((done) => {
    helpers.service.then((service) => {
      snippets = new DriveSnippets(service);
      done();
    }).catch(done);
  });

  beforeEach(() => {
    helpers.reset();
  });

  afterEach(() => {
    return helpers.cleanup();
  });

  it('should upload a file', mochaAsync(async () => {
    const id = await snippets.uploadAppData();
    expect(id).toExist();
    helpers.deleteFileOnCleanup(id);
  }));

  it('should list files', mochaAsync(async () => {
    const id = await snippets.uploadAppData();
    helpers.deleteFileOnCleanup(id);
    const files = await snippets.listAppData();
    expect(files.length).toExist();
  }));

  it('should fetch the app data folder', mochaAsync(async () => {
    const id = await snippets.fetchAppDataFolder();
    expect(id).toExist();
  }));

  it('should upload a photo', mochaAsync(async () => {
    const id = await snippets.uploadBasic();
    expect(id).toExist();
    helpers.deleteFileOnCleanup(id);
  }));

  it('should upload to a folder', mochaAsync(async () => {
    const folderId = await snippets.createFolder();
    helpers.deleteFileOnCleanup(folderId);
    const file = await snippets.uploadToFolder(folderId);
    expect(file).toExist();
    helpers.deleteFileOnCleanup(file.id);
  }));

  it('should upload and convert a document', mochaAsync(async () => {
    const id = await snippets.uploadWithConversion();
    expect(id).toExist();
    helpers.deleteFileOnCleanup(id);
  }));

  it('should export a PDF', mochaAsync(async () => {
    const file = await helpers.createTestDocument();
    const content = await snippets.exportPdf(file.id);
    expect(content).toExist();
    expect(content.toString('utf8', 0, 4)).toEqual('%PDF');
  }));

  it('should download a photo', mochaAsync(async () => {
    const file = await helpers.createTestBlob();
    const content = await snippets.downloadFile(file.id);
    expect(content).toExist();
    expect(content[0]).toEqual(0xFF);
    expect(content[1]).toEqual(0xD8);
  }));

  it('should create a shortcut', mochaAsync(async () => {
    const id = await snippets.createShortcut();
    expect(id).toExist();
    helpers.deleteFileOnCleanup(id);
  }));

  it('should update the modified time', mochaAsync(async () => {
    const file = await helpers.createTestBlob();
    const now = new Date().toISOString();
    const modifiedTime = await snippets.touchFile(file.id, now);
    expect(modifiedTime).toEqual(now);
  }));

  it('should create a folder', mochaAsync(async () => {
    const id = await snippets.createFolder();
    expect(id).toExist();
    helpers.deleteFileOnCleanup(id);
  }));

  it('should move a file', mochaAsync(async () => {
    const folderId = await snippets.createFolder();
    const file = await helpers.createTestBlob();
    helpers.deleteFileOnCleanup(folderId);
    const movedFile = await snippets.moveFileToFolder(file.id, folderId);
    expect(movedFile.parents).toInclude(folderId);
    expect(movedFile.parents.length).toEqual(1);
  }));

  it('should search files', mochaAsync(async () => {
    await helpers.createTestBlob();
    const files = await snippets.searchFiles();
    expect(files.length).toExist();
  }));

  it('should share files', mochaAsync(async () => {
    const file = await helpers.createTestBlob();
    const ids = await snippets.shareFile(
        file.id,
        'user@test.appsdevtesting.com',
        'test.appsdevtesting.com');
    expect(ids.length).toEqual(2);
  }));

  it('should fetch the start page token', mochaAsync(async () => {
    const token = await snippets.fetchStartPageToken();
    expect(token).toExist();
  }));

  it('should fetch changes', mochaAsync(async () => {
    const startToken = await snippets.fetchStartPageToken();
    await helpers.createTestBlob();
    const token = await snippets.fetchChanges(startToken);
    expect(token).toExist();
    expect(token).toNotEqual(startToken);
  }));

  // Note, you must enable creating Team Drives for your service account.
  // https://support.google.com/a/answer/7337635?hl=en
  it('should create a team drive', mochaAsync(async () => {
    const id = await snippets.createTeamDrive();
    expect(id).toExist();
    await service.teamdrives.delete({teamDriveId: id});
  }));

  // Note, you must enable creating Team Drives for your service account.
  // https://support.google.com/a/answer/7337635?hl=en
  it('should recover team drives', mochaAsync(async () => {
    await createOrphanedTeamDrive();
    const teamDrives = await snippets.recoverTeamDrives('sbazyl@test.appsdevtesting.com');
    expect(teamDrives.length).toExist();
  }));

  /**
   * Creates a standalone Team Drive.
   * @return {Promise<string>} The id of the new Team Drive.
   */
  function createOrphanedTeamDrive() {
    return snippets.createTeamDrive().then((fileId) => {
      return helpers.service.then((service) => {
        return new Promise((resolve, reject) => {
          service.permissions.list({
            fileId,
            supportsTeamDrives: true,
          }, (err, res) => {
            if (err) {
              reject(err);
            } else {
              async.forEach(res.permissions, (permission, callback) => {
                service.permissions.delete({
                  fileId,
                  permissionId: permission.id,
                  supportsTeamDrives: true,
                }, callback);
              }, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(fileId);
                }
              });
            }
          });
        });
      });
    });
  }
});
