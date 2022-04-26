#!/bin/bash

GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/../../application_credentials.json";
export GOOGLE_APPLICATION_CREDENTIALS
mocha --timeout 60000;
