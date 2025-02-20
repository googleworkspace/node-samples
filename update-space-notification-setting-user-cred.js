const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {ChatServiceClient} = require('@google-apps/chat');
const {auth} = require('google-auth-library');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/chat.users.spacesettings'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return auth.fromJSON(credentials);
  } catch (err) {
    console.log(err);
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 * @return {Promise<OAuth2Client>}
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Updates space notification settings with user credential.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function updateSpaceNotificationSetting(authClient) {
  // Create a client
  const chatClient = new ChatServiceClient({
    authClient: authClient,
    scopes: SCOPES,
  });

  // Initialize request argument(s)
  const request = {
    spaceNotificationSetting : {
    	name : 'users/me/spaces/AAAA1XmS6pY/spaceNotificationSetting',
    	notificationSetting : 'ALL',
    	muteSetting : 'UNMUTED'
    },
    updateMask : { paths: ['notification_setting','mute_setting']}
  };
  
  // Make the request
  const result = await chatClient.updateSpaceNotificationSetting(request);

  console.log(result)
}

authorize().then(updateSpaceNotificationSetting).catch(console.error);
