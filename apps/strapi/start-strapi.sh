#!/bin/bash

# Unset any DATABASE variables from parent shell
unset DATABASE_URL DATABASE_USERNAME DATABASE_PASSWORD DATABASE_HOST DATABASE_NAME DATABASE_PORT DATABASE_SSL

# Load the .env file
set -a
source .env
set +a

# Start Strapi
yarn develop