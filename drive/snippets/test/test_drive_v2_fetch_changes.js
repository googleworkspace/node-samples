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
const fetchChanges = require('../drive_v2/change_snippets/fetch_changes');
const fetchStartPageToken = require('../drive_v2/change_snippets/fetch_start_page_token');

describe('Drive snippets', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  it('should fetch changes', async () => {
    const startToken = await fetchStartPageToken();
    await helpers.createTestBlob();
    const token = await fetchChanges(startToken);
    expect(token).toBeDefined();
    expect(token).not.toEqual(startToken);
  });
});
