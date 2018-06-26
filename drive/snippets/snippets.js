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
const fs = require('fs');
const async = require('async');
const Promise = require('promise');
const uuid = require('uuid');

/**
 * Google Drive Snippets
 */
class DriveSnippets {
  /**
   * Creates Drive Snippets with a Drive API Service
   * @param {GoogleAuth} driveService An authenticated Google Service
   */
  constructor(driveService) {
    this.driveService = driveService;
  }

  /**
   * Uploads a image.
   * @return {Promise} A promise to return an image.
   */
  async uploadBasic() {
    return new Promise((resolve, reject) => {
      // [START drive_upload_basic]
      const resource = {
        name: 'photo.jpg',
      };
      const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('files/photo.jpg'),
      };
      this.driveService.files.create({
        resource,
        media,
        fields: 'id',
      }, (err, file) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log(`File Id: ${file.id}`);
          // [START_EXCLUDE silent]
          resolve(file.id);
          // [END_EXCLUDE]
        }
      });
      // [END drive_upload_basic]
    });
  }

  /**
   * Upload a file to a Google Drive folder.
   * @param {string} realFolderId The folder ID.
   * @return {Promise} A promise to return a Google Drive file.
   */
  async uploadToFolder(realFolderId) {
    return new Promise((resolve, reject) => {
      // [START drive_upload_to_folder]
      let folderId = '0BwwA4oUTeiV1TGRPeTVjaWRDY1E';
      // [START_EXCLUDE silent]
      folderId = realFolderId;
      // [END_EXCLUDE]
      const resource = {
        name: 'photo.jpg',
        parents: [folderId],
      };
      const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('files/photo.jpg'),
      };
      this.driveService.files.create({
        resource,
        media,
        fields: 'id',
      }, (err, file) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log('File Id: ', file.id);
          // [START_EXCLUDE silent]
          resolve(file);
          // [END_EXCLUDE]
        }
      });
      // [END drive_upload_to_folder]
    });
  }

  /**
   * Uploads a CSV that is converted to a Google Spreadsheet.
   * @return {Promise<string>} A promise to return a file ID.
   */
  async uploadWithConversion() {
    return new Promise((resolve, reject) => {
      // [START drive_upload_with_conversion]
      const resource = {
        name: 'My Report',
        mimeType: 'application/vnd.google-apps.spreadsheet',
      };
      const media = {
        mimeType: 'text/csv',
        body: fs.createReadStream('files/report.csv'),
      };
      this.driveService.files.create({
        resource,
        media,
        fields: 'id',
      }, (err, file) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log('File Id:', file.id);
          // [START_EXCLUDE silent]
          resolve(file.id);
          // [END_EXCLUDE]
        }
      });
      // [END drive_upload_with_conversion]
    });
  }

  /**
   * Exports a file to PDF and downloads the file.
   * @param {string} realFileId The Drive file ID.
   * @return {Promise<string>} A promise to return the file
   */
  async exportPdf(realFileId) {
    return new Promise((resolve, reject) => {
      // [START drive_export_pdf]
      let fileId = '1ZdR3L3qP4Bkq8noWLJHSr_iBau0DNT4Kli4SxNc2YEo';
      const dest = fs.createWriteStream('/tmp/resume.pdf');
      // [START_EXCLUDE silent]
      fileId = realFileId;
      const buffers = [];
      // [END_EXCLUDE]
      this.driveService.files.export({
        fileId,
        mimeType: 'application/pdf',
      })
      // [START_EXCLUDE silent]
          .on('data', (chunk) => {
            buffers.push(chunk);
          })
          // [END_EXCLUDE]
          .on('end', () => {
            console.log('Done');
            // [START_EXCLUDE silent]
            resolve(Buffer.concat(buffers));
            // [END_EXCLUDE]
          })
          .on('error', (err) => {
            console.log('Error during download', err);
            // [START_EXCLUDE silent]
            reject(err);
            // [END_EXCLUDE]
          })
          .pipe(dest);
      // [END drive_export_pdf]
    });
  };

  /**
   * Downloads a file and returns the contents in a Promise.
   * @param {string} realFileId A Drive file ID.
   * @return {Promise} A promise to return the Drive file as a string.
   */
  async downloadFile(realFileId) {
    return new Promise((resolve, reject) => {
      // [START drive_download_file]
      let fileId = '0BwwA4oUTeiV1UVNwOHItT0xfa2M';
      const dest = fs.createWriteStream('/tmp/photo.jpg');
      // [START_EXCLUDE silent]
      fileId = realFileId;
      const buffers = [];
      // [END_EXCLUDE]
      this.driveService.files.get({
        fileId,
        alt: 'media',
      })
      // [START_EXCLUDE silent]
          .on('data', (chunk) => {
            buffers.push(chunk);
          })
          // [END_EXCLUDE]
          .on('end', () => {
            console.log('Done');
            // [START_EXCLUDE silent]
            resolve(Buffer.concat(buffers));
            // [END_EXCLUDE]
          })
          .on('error', (err) => {
            console.log('Error during download', err);
            // [START_EXCLUDE silent]
            resolve(null);
            // [END_EXCLUDE]
          })
          .pipe(dest);
      // [END drive_download_file]
    });
  }

  /**
   * Creates a Drive shortcut.
   * @return {Promise} A promise to return the Drive shortcut.
   */
  async createShortcut() {
    return new Promise((resolve, reject) => {
      // [START drive_create_shortcut]
      const resource = {
        name: 'Project plan',
        mimeType: 'application/vnd.google-apps.drive-sdk',
      };
      this.driveService.files.create({
        resource,
        fields: 'id',
      }, (err, file) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log('File Id: ', file.id);
          // [START_EXCLUDE silent]
          resolve(file.id);
          // [END_EXCLUDE]
        }
      });
      // [END drive_create_shortcut]
    });
  };

  /**
   * Updates the modified time of a file. Like bash `touch`.
   * @param {string} realFileId The real Drive file ID.
   * @param {string} realTimestamp The timestamp as an ISO string.
   * @return {Promise} A promise to return the file's modified time.
   */
  async touchFile(realFileId, realTimestamp) {
    return new Promise((resolve, reject) => {
      // [START drive_touch_file]
      let fileId = '1sTWaJ_j7PkjzaBWtNc3IzovK5hQf21FbOw9yLeeLPNQ';
      const resource = {
        'modifiedTime': new Date().toISOString(),
      };
      // [START_EXCLUDE silent]
      fileId = realFileId;
      resource.modifiedTime = realTimestamp;
      // [END_EXCLUDE]
      this.driveService.files.update({
        fileId,
        resource,
        fields: 'id, modifiedTime',
      }, (err, file) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log('Modified time: ', file.modifiedTime);
          // [START_EXCLUDE silent]
          resolve(file.modifiedTime);
          // [END_EXCLUDE]
        }
      });
      // [END drive_touch_file]
    });
  }

  /**
   * Creates a Drive folder.
   * @return {Promise} A promise to return the folder ID.
   */
  async createFolder() {
    return new Promise((resolve, reject) => {
      // [START drive_create_folder]
      this.driveService.files.create({
        resource: {
          name: 'Invoices',
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id',
      }, (err, file) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log('Folder Id: ', file.id);
          // [START_EXCLUDE silent]
          resolve(file.id);
          // [END_EXCLUDE]
        }
      });
      // [END drive_create_folder]
    });
  }

  /**
   * Moves a Drive file to a different folder.
   * @param {string} realFileId The file Id.
   * @param {*} realFolderId The new folder for the file.
   * @return {Promise} A promise to return the file in the new folder.
   */
  async moveFileToFolder(realFileId, realFolderId) {
    return new Promise((resolve, reject) => {
      // [START drive_move_file_to_folder]
      let fileId = '1sTWaJ_j7PkjzaBWtNc3IzovK5hQf21FbOw9yLeeLPNQ';
      let folderId = '0BwwA4oUTeiV1TGRPeTVjaWRDY1E';
      // [START_EXCLUDE silent]
      fileId = realFileId;
      folderId = realFolderId;
      // [END_EXCLUDE]
      // Retrieve the existing parents to remove
      this.driveService.files.get({
        fileId,
        fields: 'parents',
      }, (err, file) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          // Move the file to the new folder
          let previousParents = file.parents.join(',');
          this.driveService.files.update({
            fileId: fileId,
            addParents: folderId,
            removeParents: previousParents,
            fields: 'id, parents',
          }, (err, file) => {
            if (err) {
              // Handle error
              // [START_EXCLUDE silent]
              reject(err);
              // [END_EXCLUDE]
            } else {
              // File moved.
              // [START_EXCLUDE silent]
              resolve(file);
              // [END_EXCLUDE]
            }
          });
        }
      });
      // [END drive_move_file_to_folder]
    });
  }

  /**
   * Searches for a file in Drive by looping through files.
   * @return {Promise} A promise to return files.
   */
  async searchFiles() {
    let files = [];
    const driveService = this.driveService;
    return new Promise((resolve, reject) => {
      // [START drive_search_files]
      let pageToken = null;
      // Using the NPM module 'async'
      async.doWhilst(function(callback) {
        driveService.files.list({
          q: 'mimeType="image/jpeg"',
          fields: 'nextPageToken, files(id, name)',
          spaces: 'drive',
          pageToken,
        }, (err, res) => {
          if (err) {
            // Handle error
            console.error(err);
            callback(err);
          } else {
            // [START_EXCLUDE silent]
            Array.prototype.push.apply(files, res.files);
            // [END_EXCLUDE]
            res.files.forEach((file) => {
              console.log('Found file: ', file.name, file.id);
            });
            pageToken = res.nextPageToken;
            callback();
          }
        });
      }, () => {
        return !!pageToken;
      }, (err) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          // All pages fetched
          // [START_EXCLUDE silent]
          resolve(files);
          // [END_EXCLUDE]
        }
      });
      // [END drive_search_files]
    });
  }

  /**
   * Shares a file to a user.
   * @param {string} realFileId The file ID.
   * @param {string} realUser The user ID.
   * @param {string} realDomain The domain of the new permission.
   * @return {Promise} A promise to return the permission IDs.
   */
  async shareFile(realFileId, realUser, realDomain) {
    return new Promise((resolve, reject) => {
      let ids = [];
      // [START drive_share_file]
      let fileId = '1sTWaJ_j7PkjzaBWtNc3IzovK5hQf21FbOw9yLeeLPNQ';
      // [START_EXCLUDE silent]
      fileId = realFileId;
      // [END_EXCLUDE]
      const permissions = [{
        type: 'user',
        role: 'writer',
        emailAddress: 'user@example.com',
      }, {
        type: 'domain',
        role: 'writer',
        domain: 'example.com',
      }];
      // [START_EXCLUDE silent]
      permissions[0].emailAddress = realUser;
      permissions[1].domain = realDomain;
      // [END_EXCLUDE]
      // Using the NPM module 'async'
      async.eachSeries(permissions, (permission, permissionCallback) => {
        this.driveService.permissions.create({
          resource: permission,
          fileId: fileId,
          fields: 'id',
        }, (err, res) => {
          if (err) {
            // Handle error...
            console.error(err);
            permissionCallback(err);
          } else {
            console.log('Permission ID: ', res.id);
            // [START_EXCLUDE silent]
            ids.push(res.id);
            // [END_EXCLUDE]
            permissionCallback();
          }
        });
      }, (err) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          // All permissions inserted
          // [START_EXCLUDE silent]
          resolve(ids);
          // [END_EXCLUDE]
        }
      });
      // [END drive_share_file]
    });
  }

  /**
   * Fetches the start page token.
   * @return {Promise<string>} A promise to return the start page token.
   */
  async fetchStartPageToken() {
    return new Promise((resolve, reject) => {
      // [START drive_fetch_start_page_token]
      this.driveService.changes.getStartPageToken({}, (err, res) => {
        console.log(`Start token: ${res.startPageToken}`);
        // [START_EXCLUDE silent]
        resolve(res.startPageToken);
        // [END_EXCLUDE]
      });
      // [END drive_fetch_start_page_token]
    });
  }

  /**
   * Fetches changes to a user or Team Drive. Logs a list of changed file IDs.
   * @param {string} savedStartPageToken The start page token.
   * @return {Promise<string>} A promise to return the next start page token.
   */
  async fetchChanges(savedStartPageToken) {
    const driveService = this.driveService;
    return new Promise((resolve, reject) => {
      // [START drive_fetch_changes]
      let pageToken = savedStartPageToken;
      // Using the npm module 'async'
      async.doWhilst((callback) => {
        driveService.changes.list({
          pageToken,
          fields: 'changes,newStartPageToken',
        }, (err, res) => {
          if (err) {
            callback(err);
          } else {
            // Process changes
            res.changes.forEach((change) => {
              console.log('Change found for file:', change.fileId);
            });
            pageToken = res.nextPageToken;
            callback(res.newStartPageToken);
          }
        });
      }, () => {
        return !!pageToken;
      }, (newStartPageToken) => {
        console.log('Done fetching changes');
        // Save the token (newStartPageToken)
        // [START_EXCLUDE silent]
        resolve(newStartPageToken);
        // [END_EXCLUDE]
      });
      // [END drive_fetch_changes]
    });
  }

  /**
   * Uploads an App Data config file to Drive.
   * @return {Promise<string>} The ID of the file.
   */
  async uploadAppData() {
    return new Promise((resolve, reject) => {
      // [START drive_upload_app_data]
      const resource = {
        name: 'config.json',
        parents: ['appDataFolder'],
      };
      const media = {
        mimeType: 'application/json',
        body: fs.createReadStream('files/config.json'),
      };
      this.driveService.files.create({
        resource,
        media,
        fields: 'id',
      }, (err, file) => {
        console.log(err, file);
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log('Folder Id:', file.id);
          // [START_EXCLUDE silent]
          resolve(file.id);
          // [END_EXCLUDE]
        }
      });
      // [END drive_upload_app_data]
    });
  }

  /**
   * Lists App Data.
   * @return {Promise<Files>} A promise to return App Data files.
   */
  async listAppData() {
    return new Promise((resolve, reject) => {
      // [START drive_list_app_data]
      this.driveService.files.list({
        spaces: 'appDataFolder',
        fields: 'nextPageToken, files(id, name)',
        pageSize: 100,
      }, (err, res) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          res.files.forEach((file) => {
            console.log('Found file:', file.name, file.id);
          });
          // [START_EXCLUDE silent]
          resolve(res.files);
          // [END_EXCLUDE]
        }
      });
      // [END drive_list_app_data]
    });
  }

  /**
   * Gets the App Data folder id.
   * @param {string} realFileId The file ID.
   * @return {Promise<string>} A promise to return the folder id.
   */
  async fetchAppDataFolder(realFileId) {
    return new Promise((resolve, reject) => {
      // [START drive_fetch_app_data_folder]
      this.driveService.files.get({
        fileId: 'appDataFolder',
        fields: 'id',
      }, (err, file) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log('File Id:', file.id);
          // [START_EXCLUDE silent]
          resolve(file.id);
          // [END_EXCLUDE]
        }
      });
      // [END drive_fetch_app_data_folder]
    });
  }

  /**
   * Creates a Team Drive.
   * @return {Promise<string>} The new Team Drive's ID.
   */
  async createTeamDrive() {
    return new Promise((resolve, reject) => {
      // [START drive_create_team_drive]
      const requestId = uuid.v4();
      this.driveService.teamdrives.create({
        resource: {
          name: 'Project resources',
        },
        requestId,
        fields: 'id',
      }, (err, teamDrive) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          console.log(`Team Drive Id: ${teamDrive.id}`);
          // [START_EXCLUDE silent]
          resolve(teamDrive.id);
          // [END_EXCLUDE]
        }
      });
      // [END drive_create_team_drive]
    });
  }

  /**
   * Recovers a Team Drive without an organizer.
   * @param {string} realUser The real user ID.
   * @return {Promise<TeamDrive[]>} A list of Team Drives.
   */
  async recoverTeamDrives(realUser) {
    const driveService = this.driveService;
    let teamDrives = [];
    return new Promise((resolve, reject) => {
      // [START drive_recover_team_drives]
      let newOrganizerPermission = {
        type: 'user',
        role: 'organizer',
        emailAddress: 'user@example.com',
      };
      // [START_EXCLUDE silent]
      newOrganizerPermission.emailAddress = realUser;
      // [END_EXCLUDE]

      let pageToken;
      // Using the npm module 'async'
      async.doWhilst(function(callback) {
        driveService.teamdrives.list({
          q: 'organizerCount = 0',
          fields: 'nextPageToken, teamDrives(id, name)',
          useDomainAdminAccess: true,
          pageToken,
        }, (err, res) => {
          if (err) {
            // Handle error
            console.error(err);
            callback(err);
          } else {
            // [START_EXCLUDE silent]
            Array.prototype.push.apply(teamDrives, res.teamDrives);
            // [END_EXCLUDE]
            async.eachSeries(res.teamDrives, (teamDrive, callback) => {
              console.log('Found Team Drive without organizer:',
                  teamDrive.name, teamDrive.id);
              drive.permissions.create({
                resource: newOrganizerPermission,
                fileId: teamDrive.id,
                useDomainAdminAccess: true,
                supportsTeamDrives: true,
                fields: 'id',
              }, callback);
            }, callback);
            pageToken = res.nextPageToken;
          }
        });
      }, () => {
        return !!pageToken;
      }, (err) => {
        if (err) {
          // Handle error
          console.error(err);
          // [START_EXCLUDE silent]
          reject(err);
          // [END_EXCLUDE]
        } else {
          // All pages fetched
          // [START_EXCLUDE silent]
          resolve(teamDrives);
          // [END_EXCLUDE]
        }
      });
      // [END drive_recover_team_drives]
    });
  }
}

module.exports = DriveSnippets;
