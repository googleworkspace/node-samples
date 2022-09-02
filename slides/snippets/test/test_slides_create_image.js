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
const SlidesCreateImage = require('../slides_create_image');

describe('Presentation snippets', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  it('should create an image', async () => {
    const presentationId = await helpers.createTestPresentation();
    const ids = await helpers.addSlides(presentationId, 1, 'BLANK');
    const pageId = ids[0];
    const response = await SlidesCreateImage.createImage(
        presentationId,
        pageId,
    );
    expect(response.length).toBe(1);
    const imageId = response[0].createImage.objectId;
    expect(imageId).toBeDefined();
  });
});
