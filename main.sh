#!/bin/sh

if [[ "${example}" == "true" ]]; then
    cd ./example
    yarn install
    # yarn build
    # yarn start-ssl
    yarn dev
else
    yarn install
    yarn start
fi
