#!/bin/bash
npm run debug
terser ./webapp/build/js/main.js --compress --mangle -o ./webapp/build/js/main.js