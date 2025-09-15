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

// [START drive_export_pdf]

import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Exports a Google Doc as a PDF.
 * @param {string} fileId The ID of the file to export.
 * @return {Promise<number>} The status of the export request.
 */
async function exportPdf(fileId) {
  // Authenticate with Google and get an authorized client.
  // TODO (developer): Use an appropriate auth mechanism for your app.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive',
  });

  // Create a new Drive API client (v3).
  const service = google.drive({version: 'v3', auth});

  // Export the file as a PDF.
  const result = await service.files.export({
    fileId,
    mimeType: 'application/pdf',
  });

  // Print the status of the export.
  console.log(result.status);
  return result.status;
}
// [END drive_export_pdf]

export {exportPdf};
