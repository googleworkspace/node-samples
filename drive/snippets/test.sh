#!/bin/bash
set -e
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/../../application_credentials.json";
mocha --timeout 60000;
