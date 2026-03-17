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

import {expect} from 'expect';
import {createDrive} from '../drive_v2/drive_snippets/create_drive.js';
import {Helpers} from './helpers.js';

describe('Drive snippets', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  // Note, you must enable creating shared drives for your service account.
  // https://support.google.com/a/answer/7337635?hl=en
  it('should create a shared drive', async () => {
    const id = await createDrive();
    expect(id).toBeDefined();
    await helpers.service.teamdrives.delete({teamDriveId: id});
  });
});
