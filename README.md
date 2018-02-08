# G Suite Node Samples

Node.js samples for [G Suite API](https://developers.google.com/gsuite/) docs.

## APIs

### Apps Script

- [Quickstart](https://developers.google.com/apps-script/api/quickstart/nodejs)

### Calendar

- [Quickstart](https://developers.google.com/google-apps/calendar/quickstart/nodejs)
- [Snippets](https://developers.google.com/calendar/overview)

### Drive V3

- [Quickstart](https://developers.google.com/drive/v3/web/quickstart/nodejs)
- [Snippets](https://developers.google.com/drive/v3/web/about-sdk)

### Gmail

- [Quickstart](https://developers.google.com/gmail/api/quickstart/nodejs)
- [Snippets](https://developers.google.com/gmail/api/guides/)

### Sheets

- [Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs)
- [Snippets](https://developers.google.com/sheets/api/guides/concepts)

### Slides

- [Quickstart](https://developers.google.com/slides/quickstart/nodejs)
- [Snippets](https://developers.google.com/slides/how-tos/overview)

## Setup

1. Install [Node.js v4.5.0 or greater](https://nodejs.org).
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

Install and run eslint. Example:

```
npm run lint apps-script/**/*.js
```

Some IDEs (like VS Code) will detect these lint errors within the editor.

## Node Client Library

G Suite APIs use the [Google API Node.js client library](https://github.com/google/google-api-nodejs-client).

## Contributing

Contributions welcome! See the [Contributing Guide](CONTRIBUTING.md).
