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
const {googleapis} = require('googleapis');
const GoogleAuth = require('google-auth-library');
const fs = require('fs');

/**
 * Helper functions for Google Drive
 */
class Helpers {
  /**
   * Creates the Google API Service
   */
  constructor() {
    const client = this.buildAuthClient();
    this.service = client.then((auth) => googleapis.drive({version: 'v3', auth}));
    this.filesToDelete = [];
  }

  /**
   * Builds the Google Auth Service.
   * @return {Promise} A promise to return the Google API service.
   */
  buildAuthClient() {
    return new Promise((resolve, reject) => {
      (new GoogleAuth()).getApplicationDefault((err, authClient) => {
        if (err) return reject(err);
        const scopes = [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.appdata',
        ];
        if (authClient.createScopedRequired &&
            authClient.createScopedRequired()) {
          authClient = authClient.createScoped(scopes);
        }
        resolve(authClient);
      });
    });
  }

  /**
   * Resets the test suite.
   */
  reset() {
    this.filesToDelete = [];
  }

  /**
   * Adds the Drive file ID for deletion on cleanup.
   * @param {string} id The Drive file ID.
   */
  deleteFileOnCleanup(id) {
    this.filesToDelete.push(id);
  }

  /**
   * Cleans up the test suite.
   * @return {Promise} A promise to return the Google API service.
   */
  cleanup() {
    return this.service.then((drive) => {
      const deleteFile = Promise.denodeify(drive.files.delete).bind(drive.files);
      return this.filesToDelete.map((id) => {
        console.log('Cleaning up file', id);
        return deleteFile({fileId: id});
      });
    });
  }

  /**
   * Creates a test Drive file.
   * @param {string} fileMetadata The Drive file's metadata
   * @param {Media} media A media object
   * @return {Promise} A promise to return the Google API service.
   */
  createFile(fileMetadata, media) {
    return this.service.then((drive) => {
      const createFile = Promise.denodeify(drive.files.create).bind(drive.files);
      return createFile({
        resource: fileMetadata,
        media,
        fields: 'id',
      }).then((file) => {
        this.deleteFileOnCleanup(file.id);
        return file;
      });
    });
  }

  /**
   * Creates a test Google Docs document.
   * @return {Promise} A promise to return the Google Drive file.
   */
  createTestDocument() {
    return this.createFile({
      name: 'Test Document',
      mimeType: 'application/vnd.google-apps.document',
    }, {
      mimeType: 'text/plain',
      body: fs.createReadStream('files/document.txt'),
    });
  }

  /**
   * Uploads a test image to Google Drive.
   * @return {Promise} A promise to return the Google Drive file.
   */
  createTestBlob() {
    return this.createFile({
      name: 'photo.jpg',
    }, {
      mimeType: 'image/jpeg',
      body: fs.createReadStream('files/photo.jpg'),
    });
  }
}

module.exports = Helpers;
