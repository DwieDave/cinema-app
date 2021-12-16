#!/bin/bash
npm run debug
lessc -clean-css ./webapp/src/styles/style.less ./webapp/build/styles/style.css 
terser ./webapp/build/js/main.js --compress --mangle -o ./webapp/build/js/main.js