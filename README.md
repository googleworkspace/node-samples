# Node.js samples for [Google Workspace APIs](https://developers.google.com/workspace/) docs

This repository contains Node.js samples for Google Workspace APIs.

## Development

1. Install [Node.js](https://nodejs.org).
1. Install `pnpm` by running `npm install -g pnpm` or see additional options at https://pnpm.io/installation.
    `pnpm` is used with `turborepo` to better handled the many packages in the repository.
1. Create a Service Account

    Before running tests, create a service account and download `application_credentials.json` in this directory.

    To create a service account, follow these steps:

    1. Navigate to the [Google Cloud Console API Dashboard](https://console.cloud.google.com/apis/dashboard)
    1. Enable APIs for products you'd like to test snippets for like Slides or Drive.
    1. Create a service account key under [Credentials](https://console.cloud.google.com/apis/credentials).
    1. After creating a new JSON Service account key without a role and set the env variable `SERVICE_ACCOUNT_CREDENTIALS=some/path/to/application_credentials.json`.

1. `pnpm test`
1. `pnpm lint`
1. Delete service account file.
1. `pnpx codemod pnpm/catalog` to add package dependencies to the catalog

## Contributing

Contributions welcome! See the [Contributing Guide](CONTRIBUTING.md).
