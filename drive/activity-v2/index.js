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
// [START drive_activity_v2_quickstart]
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/drive.activity.readonly'});
/**
 * Lists the recent activity in your Google Drive.
 *
 * @param {Googleauth} auth The Google default authenticated
 * */
function listDriveActivity(auth) {
  const service = google.driveactivity({version: 'v2', auth});
  const params = {
    'pageSize': 10,
  };
  service.activity.query({requestBody: params}, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const activities = res.data.activities;
    if (activities) {
      console.log('Recent activity:');
      activities.forEach((activity) => {
        const time = getTimeInfo(activity);
        const action = getActionInfo(activity.primaryActionDetail);
        const actors = activity.actors.map(getActorInfo);
        const targets = activity.targets.map(getTargetInfo);
        console.log(`${time}: ${truncated(actors)}, ${action}, ` +
                            `${truncated(targets)}`);
      });
    } else {
      console.log('No activity.');
    }
  });
}

/**
 * Returns a string representation of the first elements in a list.
 *
 * @param {Array<Object>} array The array to convert to a short string.
 * @param {number} limit The number of elements to show before truncating.
 * @return {string}
 */
function truncated(array, limit = 2) {
  const contents = array.slice(0, limit).join(', ');
  const more = array.length > limit ? ', ...' : '';
  return `[${contents}${more}]`;
}

/**
 * Returns the name of a set property in an object, or else "unknown".
 *
 * @param {Object} object The object in which to find the set property.
 * @return {string}
 */
function getOneOf(object) {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      return key;
    }
  }
  return 'unknown';
}

/**
 * Returns a time associated with an activity.
 *
 * @param {Object} activity The DriveActivity from which to extract a time.
 * @return {string}
 */
function getTimeInfo(activity) {
  if ('timestamp' in activity) {
    return activity.timestamp;
  }
  if ('timeRange' in activity) {
    return activity.timeRange.endTime;
  }
  return 'unknown';
}

/**
 * Returns the type of action.
 *
 * @param {Object} actionDetail The ActionDetail to summarize.
 * @return {string}
 */
function getActionInfo(actionDetail) {
  return getOneOf(actionDetail);
}

/**
 * Returns user information, or the type of user if not a known user.
 *
 * @param {Object} user The User to summarize.
 * @return {string}
 */
function getUserInfo(user) {
  if ('knownUser' in user) {
    const knownUser = user.knownUser;
    const isMe = knownUser.isCurrentUser || false;
    return isMe ? 'people/me' : knownUser.personName;
  }
  return getOneOf(user);
}

/**
 * Returns actor information, or the type of actor if not a user.
 *
 * @param {Object} actor The Actor to summarize.
 * @return {string}
 */
function getActorInfo(actor) {
  if ('user' in actor) {
    return getUserInfo(actor.user);
  }
  return getOneOf(actor);
}

/**
 * Returns the type of a target and an associated title.
 *
 * @param {Object} target The Target to summarize.
 * @return {string}
 */
function getTargetInfo(target) {
  if ('driveItem' in target) {
    const title = target.driveItem.title || 'unknown';
    return `driveItem:"${title}"`;
  }
  if ('drive' in target) {
    const title = target.drive.title || 'unknown';
    return `drive:"${title}"`;
  }
  if ('fileComment' in target) {
    const parent = target.fileComment.parent || {};
    const title = parent.title || 'unknown';
    return `fileComment:"${title}"`;
  }
  return `${getOneOf(target)}:unknown`;
}
// [END drive_activity_v2_quickstart]

listDriveActivity(auth);
