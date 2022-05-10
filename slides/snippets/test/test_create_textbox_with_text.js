/**
 * @license
 * Copyright Google Inc.
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
const expect = require('expect');
const Helpers = require('./helpers');
const SlidesCreateTextboxWithText = require('../slides_create_textbox_with_text');

const mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(done, (err) => {
      done(err);
    });
  };
};

describe('Presentation snippets', () => {
  const helpers = new Helpers();

  before((done) => {
    Promise.all([
      helpers.driveService,
      helpers.slidesService,
    ]).then((services) => {
      done();
    }).catch(done);
  });

  beforeEach(() => {
    helpers.reset();
  });

  after(() => {
    helpers.cleanup();
    return new Promise((resolve) => setTimeout(resolve, 10));
  });

  it('should create a textbox with text', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    const ids = await helpers.addSlides(presentationId, 1, 'BLANK');
    const pageId = ids[0];
    console.log(pageId + ' ' + presentationId);
    const response = await SlidesCreateTextboxWithText.createTextboxWithText(
        presentationId, pageId);
    expect(response.replies.length).toEqual(2);
    const boxId = response.replies[0].createShape.objectId;
    expect(boxId).toExist();
  }));
});
