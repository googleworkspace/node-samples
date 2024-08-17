/**
 * Copyright 2024 Google LLC
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

// [START chat_authentication_utils]

import http from 'http';
import url from 'url';
import open from 'open';
import destroyer from 'server-destroy';
import {readFile} from 'fs/promises';
import {OAuth2Client} from 'google-auth-library';
import {ChatServiceClient} from '@google-apps/chat';

// Application authentication
const SERVICE_ACCOUNT_FILE = './service_account.json';
const APP_AUTH_OAUTH_SCOPES = ['https://www.googleapis.com/auth/chat.bot'];

// User authentication
const CLIENT_SECRETS_FILE = './client_secrets.json';
const CLIENT_SECRETS = JSON.parse(await readFile(
    new URL(CLIENT_SECRETS_FILE, import.meta.url)
)).web;

/**
 * Create a new Chat service client with application credentials.
 *
 * @returns {ChatServiceClient} The resulting client for the Chat service
 */
export function createClientWithAppCredentials () {
  // For more information on app authentication, see
  // https://developers.google.com/workspace/chat/authenticate-authorize-chat-app
  return new ChatServiceClient({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: APP_AUTH_OAUTH_SCOPES,
  });
}

/**
 * Create a new Chat service client with user credentials and scopes.
 *
 * @param {!string[]} scopes Required scopes for the desired API requests
 * @returns {Promise<ChatServiceClient>} The resulting client for the Chat service
 */
export async function createClientWithUserCredentials (scopes) {
  // For more information on user authentication, see
  // https://developers.google.com/workspace/chat/authenticate-authorize-chat-user
  return new ChatServiceClient({
    authClient: await getAuthenticatedUserOAuth2Client(scopes),
    scopes: scopes,
  });
}

/**
 * Create a new OAuth2 client and go through the OAuth2 flow.
 *
 * @param {!string[]} scopes Required scopes for the desired API requests
 * @returns {Promise<OAuth2Client>} The resulting Google OAuth2 client
 */
function getAuthenticatedUserOAuth2Client(scopes) {
  return new Promise((resolve, reject) => {
    // Create a client based on client secrets
    const oAuth2Client = new OAuth2Client(
      CLIENT_SECRETS.client_id,
      CLIENT_SECRETS.client_secret,
      CLIENT_SECRETS.redirect_uris[0]
    );

    // Generate the URL to use for consent
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    // Open an HTTP server to accept the OAuth2 callback
    const server = http.createServer(async (request, response) => {
      try {
        if (request.url.indexOf('/oauth2callback') > -1) {
          // Acquire the code and close the server.
          const queryString =
            new url.URL(request.url, 'http://localhost:3000').searchParams;
          const code = queryString.get('code');
          response.end('Done!');
          server.destroy();
          // Acquire the tokens
          const r = await oAuth2Client.getToken(code);
          // Update credentials of the OAuth2 client.
          oAuth2Client.setCredentials(r.tokens);
          resolve(oAuth2Client);
        }
      } catch (e) {
        reject(e);
      }
    }).listen(3000, () => {
      // Open default browser and start the flow
      open(authorizeUrl, {wait: false}).then(cp => cp.unref());
    });
    destroyer(server);
  });
}

// [END chat_authentication_utils]
