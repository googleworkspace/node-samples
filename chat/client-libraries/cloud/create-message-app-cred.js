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
// It may require modifications to work in your environment.

// [START chat_create_message_app_cred]

import {createClientWithAppCredentials} from './authentication-utils.js';

// This sample shows how to create message with app credential
async function main() {
  // Create a client
  const chatClient = createClientWithAppCredentials();

  // Initialize request argument(s)
  const request = {
    // Replace SPACE_NAME here.
    parent: 'spaces/SPACE_NAME',
    message: {
      text: '👋🌎 Hello world! I created this message by calling ' +
            'the Chat API\'s `messages.create()` method.',
      cardsV2 : [{ card: {
        header: {
          title: 'About this message',
          imageUrl: 'https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/info/default/24px.svg'
        },
        sections: [{
          header: 'Contents',
          widgets: [{ textParagraph: {
              text: '🔡 <b>Text</b> which can include ' +
                    'hyperlinks 🔗, emojis 😄🎉, and @mentions 🗣️.'
            }}, { textParagraph: {
              text: '🖼️ A <b>card</b> to display visual elements' +
                    'and request information such as text 🔤, ' +
                    'dates and times 📅, and selections ☑️.'
            }}, { textParagraph: {
              text: '👉🔘 An <b>accessory widget</b> which adds ' +
                    'a button to the bottom of a message.'
            }}
          ]}, {
            header: "What's next",
            collapsible: true,
            widgets: [{ textParagraph: {
                text: "❤️ <a href='https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages.reactions/create'>Add a reaction</a>."
              }}, { textParagraph: {
                text: "🔄 <a href='https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/patch'>Update</a> " +
                      "or ❌ <a href='https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/delete'>delete</a> " +
                      "the message."
              }
            }]
          }
        ]
      }}],
      accessoryWidgets: [{ buttonList: { buttons: [{
        text: 'View documentation',
        icon: { materialIcon: { name: 'link' }},
        onClick: { openLink: {
          url: 'https://developers.google.com/workspace/chat/create-messages'
        }}
      }]}}]
    }
  };

  // Make the request
  const response = await chatClient.createMessage(request);

  // Handle the response
  console.log(response);
}

main().catch(console.error);

// [END chat_create_message_app_cred]
