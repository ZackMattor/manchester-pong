#!/bin/bash

./node_modules/.bin/webpack

mkdir www
mkdir www/kiosk

cp src/mobile.html www/index.html
cp src/web_display_test.html www/test.html
cp src/web_display.html www/kiosk/index.html
