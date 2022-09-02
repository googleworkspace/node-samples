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
const SlidesCreateSlide = require('../slides_create_slide');

describe('Presentation snippets', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  it('should create a slide', async () => {
    const presentationId = await helpers.createTestPresentation();
    await helpers.addSlides(presentationId, 3, 'TITLE_AND_TWO_COLUMNS');
    const pageId = 'my_page_id';
    const response = await SlidesCreateSlide.createSlide(
        presentationId,
        pageId,
    );
    expect(pageId).toEqual(response.data.replies[0].createSlide.objectId);
  });
});
