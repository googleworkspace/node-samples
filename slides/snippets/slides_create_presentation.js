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

// [START slides_create_presentation]
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Creates a new Google Slides presentation.
 * @param {string} title The title for the new presentation.
 * @return {Promise<object>} The created presentation.
 */
async function createPresentation(title) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/presentations',
  });

  // Create a new Slides API client.
  const service = google.slides({version: 'v1', auth});

  // Create a new presentation with the specified title.
  const presentation = await service.presentations.create({
    title,
  });

  // Log the ID of the new presentation.
  console.log(
    `Created presentation with ID: ${presentation.data.presentationId}`,
  );
  return presentation;
}
// [END slides_create_presentation]

export {createPresentation};
