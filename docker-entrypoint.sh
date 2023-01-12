#!/bin/sh
NODE_ENV=${NODE_ENV:-production}

set -eux
if [ "$NODE_ENV" != 'production' ]; then
    #yarn install --pure-lockfile
    npm install
    # see https://docs.npmjs.com/cli/ci 
    node app
fi

exec "$@"