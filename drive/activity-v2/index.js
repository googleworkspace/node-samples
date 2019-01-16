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
// [START drive_activity_v2_quickstart]
const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.activity.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err)
  // Authorize a client with credentials, then call the Google Drive Activity
  // API.
  authorize(JSON.parse(content), listDriveActivity)
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize (credentials, callback) {
  const { clientSecret, clientId, redirectUris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    clientId, clientSecret, redirectUris[0])

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken (oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

/**
 * Lists the recent activity in your Google Drive.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listDriveActivity (auth) {
  const service = google.driveactivity({ version: 'v2', auth })
  const params = {
    'pageSize': 10
  }
  service.activity.query({ requestBody: params }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err)
    const activities = res.data.activities
    if (activities) {
      console.log('Recent activity:')
      activities.forEach((activity) => {
        var time = getTimeInfo(activity)
        var action = getActionInfo(activity['primaryActionDetail'])
        var actors = activity.actors.map(getActorInfo)
        var targets = activity.targets.map(getTargetInfo)
        console.log(`${time}: ${truncated(actors)}, ${action}, ` +
                            `${truncated(targets)}`)
      })
    } else {
      console.log('No activity.')
    }
  })
}

/** Returns a string representation of the first elements in a list. */
function truncated (array, limit = 2) {
  var contents = array.slice(0, limit).join(', ')
  var more = array.length > limit ? ', ...' : ''
  return `[${contents}${more}]`
}

/** Returns the name of a set property in an object, or else "unknown". */
function getOneOf (object) {
  for (var key in object) {
    return key
  }
  return 'unknown'
}

/** Returns a time associated with an activity. */
function getTimeInfo (activity) {
  if ('timestamp' in activity) {
    return activity.timestamp
  }
  if ('timeRange' in activity) {
    return activity.timeRange.endTime
  }
  return 'unknown'
}

/** Returns the type of action. */
function getActionInfo (actionDetail) {
  return getOneOf(actionDetail)
}

/** Returns user information, or the type of user if not a known user. */
function getUserInfo (user) {
  if ('knownUser' in user) {
    var knownUser = user['knownUser']
    var isMe = knownUser['isCurrentUser'] || false
    return isMe ? 'people/me' : knownUser['personName']
  }
  return getOneOf(user)
}

/** Returns actor information, or the type of actor if not a user. */
function getActorInfo (actor) {
  if ('user' in actor) {
    return getUserInfo(actor['user'])
  }
  return getOneOf(actor)
}

/** Returns the type of a target and an associated title. */
function getTargetInfo (target) {
  if ('driveItem' in target) {
    var itemTitle = target.driveItem.title || 'unknown'
    return `driveItem:"${itemTitle}"`
  }
  if ('teamDrive' in target) {
    var driveTitle = target.teamDrive.title || 'unknown'
    return `teamDrive:"${driveTitle}"`
  }
  if ('fileComment' in target) {
    var parent = target.fileComment.parent || {}
    var parentTitle = parent.title || 'unknown'
    return `fileComment:"${parentTitle}"`
  }
  return `${getOneOf(target)}:unknown`
}
// [END drive_activity_v2_quickstart]
