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
const SlidesImageMerging = require('../slides_image_merging');

const TEMPLATE_PRESENTATION_ID = '1MmTR712m7U_kgeweE57POWwkEyWAV17AVAWjpmltmIg';
const IMAGE_URL =
  'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
const CUSTOMER_NAME = 'Fake Customer';

describe('Presentation snippets', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  it('should ImageMerging', async () => {
    const response = await SlidesImageMerging.imageMerging(
        TEMPLATE_PRESENTATION_ID,
        IMAGE_URL,
        CUSTOMER_NAME,
    );
    const presentationId = response.presentationId;
    expect(presentationId).toBeDefined();
    expect(2).toEqual(response.replies.length);
    let numReplacements = 0;
    for (let i = 0; i < response.replies.length; ++i) {
      numReplacements +=
        response.replies[i].replaceAllShapesWithImage.occurrencesChanged;
    }
    expect(2).toEqual(numReplacements);
  });
});
