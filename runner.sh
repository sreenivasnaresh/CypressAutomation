#!/bin/bash
pwd
echo "Installing dependencies ..."
npm install cypress@9.1.1
npm insatll
echo "started running cypress tests ...."
npm run cypress:app_run && error_code=0 || error_code=$?;