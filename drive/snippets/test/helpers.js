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
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');
const fs = require('fs');

/**
 * Helper functions for Google Drive
 */
class Helpers {
  /**
   * Creates the Google API Service
   */
  constructor() {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/drive',
    });
    this.service = google.drive({version: 'v3', auth});
    this.filesToDelete = [];
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
    return Promise.all(
        this.filesToDelete.map((fileId) => this.service.files.delete({fileId})),
    );
  }

  /**
   * Creates a test Drive file.
   * @param {string} fileMetadata The Drive file's metadata
   * @param {Media} media A media object
   * @return {Promise} A promise to return the Google API service.
   */
  async createFile(fileMetadata, media) {
    const file = await this.service.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });

    this.deleteFileOnCleanup(file.data.id);
    return file;
  }

  /**
   * Creates a test Google Docs document.
   * @return {Promise} A promise to return the Google Drive file.
   */
  createTestDocument() {
    return this.createFile(
        {
          name: 'Test Document',
          mimeType: 'application/vnd.google-apps.document',
        },
        {
          mimeType: 'text/plain',
          body: fs.createReadStream('files/document.txt'),
        },
    );
  }

  /**
   * Uploads a test image to Google Drive.
   * @return {Promise} A promise to return the Google Drive file.
   */
  async createTestBlob() {
    const file = await this.createFile(
        {
          name: 'photo.jpg',
        },
        {
          mimeType: 'image/jpeg',
          body: fs.createReadStream('files/photo.jpg'),
        },
    );

    return file;
  }
}

module.exports = Helpers;
