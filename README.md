# Node.js samples for [Google Workspace APIs](https://developers.google.com/workspace/) docs

API| Quickstart| Snippets
---| ---| ---
**Apps&nbsp;Script**| [Link](https://developers.google.com/apps-script/api/quickstart/nodejs)| ---
**Calendar**| [Link](https://developers.google.com/google-apps/calendar/quickstart/nodejs)| [Link](https://developers.google.com/calendar/overview)
**Classroom**| [Link](https://developers.google.com/classroom/quickstart/nodejs)| [Link](https://developers.google.com/classroom/guides/get-started)
**Drive V3**| [Link](https://developers.google.com/drive/v3/web/quickstart/nodejs)| [Link](https://developers.google.com/drive/v3/web/about-sdk)
**Gmail**| [Link](https://developers.google.com/gmail/api/quickstart/nodejs)| [Link](https://developers.google.com/gmail/api/guides/)
**Sheets**| [Link](https://developers.google.com/sheets/api/quickstart/nodejs)| [Link](https://developers.google.com/sheets/api/guides/concepts)
**Slides**| [Link](https://developers.google.com/slides/quickstart/nodejs)| [Link](https://developers.google.com/slides/how-tos/overview)
**Tasks**| [Link](https://developers.google.com/tasks/quickstart/nodejs)| ---

## Sample Types

### Quickstarts

In about **five minutes**, you'll have a simple Node.js command-line application that makes requests to a Google Workspace API.

### Guides

Learn how to use functions within an API, such as creating a new Google Slide to adding values to a Google Spreadsheet.

## Other APIs

### Admin SDK

- [Directory Quickstart](https://developers.google.com/admin-sdk/directory/v1/quickstart/nodejs)
- [Reports Quickstart](https://developers.google.com/admin-sdk/reports/v1/quickstart/nodejs)
- [Reseller Quickstart](https://developers.google.com/admin-sdk/reseller/v1/quickstart/nodejs)

## Setup

1. Install [Node.js v6.4.0 or greater](https://nodejs.org).
1. Clone this repository.
1. Follow the folder README instructions to run and test samples.

### Run Snippet Tests

#### Create a Service Account

Before running tests, create a service account and download `application_credentials.json` in this directory.

To create a service account, follow these steps:

1. Navigate to the [Google Cloud Console API Dashboard](https://console.cloud.google.com/apis/dashboard)
1. Enable APIs for products you'd like to test snippets for like Slides or Drive.
1. Create a service account key under [Credentials](https://console.cloud.google.com/apis/credentials).
1. After creating a new JSON Service account key without a role, rename the downloaded file to `application_credentials.json` and move the file to this directory.

#### Run tests

In any snippet directory, `npm run test`.

### Lint

Install and run ESLint. Example:

```shell
npm run lint apps-script/**/*.js
```

Some IDEs (like VS Code) will detect these lint errors within the editor.

## Node.js Client Library

Google Workspace APIs use the [Google API Node.js client library](https://github.com/google/google-api-nodejs-client).

## Contributing

Contributions welcome! See the [Contributing Guide](CONTRIBUTING.md).
