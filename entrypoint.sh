#!/bin/bash

# npx ts-node ./node_modules/typeorm/cli migration:run -d ./src/config/typeorm.ts
npx ts-node ./node_modules/typeorm/cli migration:run -d ./dist/config/typeorm.js
if [ $? -ne 0 ]; then
    echo "Migration failed"
    exit 1
fi

node --max-old-space-size=8192 ./dist/main.js
