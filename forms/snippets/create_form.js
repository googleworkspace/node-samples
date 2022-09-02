// Copyright 2022 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// [START forms_create_form]

'use strict';

const path = require('path');
const google = require('@googleapis/forms');
const {authenticate} = require('@google-cloud/local-auth');

async function runSample(query) {
  const authClient = await authenticate({
    keyfilePath: path.join(__dirname, 'credentials.json'),
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const forms = google.forms({
    version: 'v1',
    auth: authClient,
  });
  const newForm = {
    info: {
      title: 'Creating a new form in Node',
    },
  };
  const res = await forms.forms.create({
    requestBody: newForm,
  });
  console.log(res.data);
  return res.data;
}

if (module === require.main) {
  runSample().catch(console.error);
}
module.exports = runSample;

// [END forms_create_form]
