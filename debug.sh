#!/bin/bash
cp ./webapp/src/index.html ./webapp/build/index.html 
cp -r ./webapp/src/img ./webapp/build/ 
lessc -clean-css ./webapp/src/styles/style.less ./webapp/build/styles/style.css 
browserify ./webapp/src/js/Main.js ./node_modules/uikit/dist/js/uikit.js ./node_modules/uikit/dist/js/uikit-icons.js -o ./webapp/build/js/main.js