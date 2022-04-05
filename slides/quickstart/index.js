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
// [START slides_quickstart]
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/presentations.readonly'});

/**
 * Prints the number of slides and elements in a sample presentation:
 * https://docs.google.com/presentation/d/1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXc67Jo2O9C6Vuc/edit
 * @param {Googleauth} auth The Google default authenticated
 */
function listSlides(auth) {
  const slides = google.slides({version: 'v1', auth});
  slides.presentations.get({
    presentationId: '1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXc67Jo2O9C6Vuc',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const length = res.data.slides.length;
    console.log('The presentation contains %s slides:', length);
    res.data.slides.map((slide, i) => {
      console.log(`- Slide #${i + 1} contains ${slide.pageElements.length} elements.`);
    });
  });
}
// [END slides_quickstart]

listSlides(auth);
