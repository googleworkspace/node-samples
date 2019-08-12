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
const Snippets = require('../snippets');

// Constants
const IMAGE_URL =
    'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
const TEMPLATE_PRESENTATION_ID = '1MmTR712m7U_kgeweE57POWwkEyWAV17AVAWjpmltmIg';
const DATA_SPREADSHEET_ID = '14KaZMq2aCAGt5acV77zaA_Ps8aDt04G7T0ei4KiXLX8';
const CHART_ID = 1107320627;
const CUSTOMER_NAME = 'Fake Customer';

const mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(done, (err) => {
      done(err);
    });
  };
};

describe('Presentation snippets', () => {
  const helpers = new Helpers();
  let snippets;

  before((done) => {
    Promise.all([
      helpers.driveService,
      helpers.slidesService,
      helpers.sheetsService,
    ]).then((services) => {
      snippets = new Snippets(services);
      done();
    }).catch(done);
  });

  beforeEach(() => {
    helpers.reset();
  });

  afterEach(() => {
    return helpers.cleanup();
  });

  it('should create a presentation', mochaAsync(async () => {
    const presentation = await snippets.createPresentation('Title');
    expect(presentation).toExist();
    helpers.deleteFileOnCleanup(presentation.presentationId);
  }));
  it('should copy a presentation', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    const copyId = await snippets.copyPresentation(presentationId, 'My Duplicate, Presentation');
    expect(copyId).toExist();
    helpers.deleteFileOnCleanup(copyId);
  }));
  it('should create a slide', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    await helpers.addSlides(presentationId, 3, 'TITLE_AND_TWO_COLUMNS');
    let pageId = 'my_page_id';
    let response = await snippets.createSlide(presentationId, pageId);
    expect(pageId).toEqual(response.replies[0].createSlide.objectId);
  }));
  it('should create a textbox with text', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    const ids = await helpers.addSlides(presentationId, 1, 'BLANK');
    const pageId = ids[0];
    const response = await snippets.createTextboxWithText(presentationId, pageId);
    expect(response.replies.length).toEqual(2);
    const boxId = response.replies[0].createShape.objectId;
    expect(boxId).toExist();
  }));
  it('should create an image', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    const ids = await helpers.addSlides(presentationId, 1, 'BLANK');
    const pageId = ids[0];
    const response = await snippets.createImage(presentationId, pageId);
    expect(response.length).toBe(1);
    const imageId = response[0].createImage.objectId;
    expect(imageId).toExist();
  }));
  it('should merge text', mochaAsync(async () => {
    const responses = await snippets.textMerging(TEMPLATE_PRESENTATION_ID, DATA_SPREADSHEET_ID);
    expect(5).toEqual(responses.length);
    responses.forEach((response) => {
      let numReplacements = 0;
      for (let i = 0; i < response.length; ++i) {
        numReplacements += response[i].replaceAllText.occurrencesChanged;
      }
      expect(4).toEqual(numReplacements);
    });
  }));
  it('should ImageMerging', mochaAsync(async () => {
    const response = await snippets.imageMerging(TEMPLATE_PRESENTATION_ID, IMAGE_URL,
      CUSTOMER_NAME);
    const presentationId = response.presentationId;
    expect(presentationId).toExist();
    expect(2).toEqual(response.replies.length);
    let numReplacements = 0;
    for (let i = 0; i < response.replies.length; ++i) {
      numReplacements += response.replies[i].replaceAllShapesWithImage.occurrencesChanged;
    }
    expect(2).toEqual(numReplacements);
  }));
  it('should SimpleTextReplace', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    const pageIds = await helpers.addSlides(presentationId, 1, 'BLANK');
    let pageId = pageIds[0];
    const boxId = await helpers.createTestTextbox(presentationId, pageId);
    const response = await snippets.simpleTextReplace(presentationId, boxId, 'MY NEW TEXT');
    expect(2).toEqual(response.replies.length);
  }));
  it('should TextStyleUpdate', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    const pageIds = await helpers.addSlides(presentationId, 1, 'BLANK');
    let pageId = pageIds[0];
    const boxId = await helpers.createTestTextbox(presentationId, pageId);
    const response = await snippets.textStyleUpdate(presentationId, boxId);
    expect(3).toEqual(response.replies.length);
  }));
  it('should CreateBulletedText', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    const pageIds = await helpers.addSlides(presentationId, 1, 'BLANK');
    const pageId = pageIds[0];
    const boxId = await helpers.createTestTextbox(presentationId, pageId);
    const response = await snippets.createBulletedText(presentationId, boxId);
    expect(1).toEqual(response.replies.length);
    helpers.deleteFileOnCleanup(presentationId);
  }));
  it('should CreateSheetsChart', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    const pageIds = await helpers.addSlides(presentationId, 1, 'BLANK');
    const pageId = pageIds[0];
    const response = await snippets.createSheetsChart(presentationId, pageId, DATA_SPREADSHEET_ID,
      CHART_ID);
    expect(1).toEqual(response.replies.length);
    const chartId = response.replies[0].createSheetsChart.objectId;
    expect(chartId).toExist();
  }));
  it('should RefreshSheetsChart', mochaAsync(async () => {
    const presentationId = await helpers.createTestPresentation();
    const pageIds = await helpers.addSlides(presentationId, 1, 'BLANK');
    const pageId = pageIds[0];
    const sheetChartId = await helpers.createTestSheetsChart(presentationId, pageId,
      DATA_SPREADSHEET_ID, CHART_ID);
    const response = await snippets.refreshSheetsChart(presentationId, sheetChartId);
    expect(1).toEqual(response.replies.length);
  }));
});
