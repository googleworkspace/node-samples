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
const SlidesCreatePresentation = require('../slides_create_presentation');

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

  it('should create a presentation', mochaAsync(async () => {
    const presentation = await SlidesCreatePresentation.createPresentation('Title');
    expect(presentation).toExist();
    helpers.deleteFileOnCleanup(presentation.data.presentationId);
  }));
});
