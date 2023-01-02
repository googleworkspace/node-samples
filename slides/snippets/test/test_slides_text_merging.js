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
const SlidesTextMerging = require('../slides_text_merging');

const TEMPLATE_PRESENTATION_ID = '1MmTR712m7U_kgeweE57POWwkEyWAV17AVAWjpmltmIg';

describe('Presentation snippets', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  it('should merge text', async () => {
    let sheetId = await helpers.createTestSpreadsheet();
    sheetId = await helpers.populateValues(sheetId);
    const responses = await SlidesTextMerging.textMerging(
        TEMPLATE_PRESENTATION_ID,
        sheetId,
    );
    // console.log(responses);
    expect(3).toEqual(responses.replies.length);
    let numReplacements = 0;
    for (let i = 0; i < responses.replies.length; ++i) {
      numReplacements += responses.replies[i].replaceAllText.occurrencesChanged;
    }
    expect(4).toEqual(numReplacements);
  });
});
