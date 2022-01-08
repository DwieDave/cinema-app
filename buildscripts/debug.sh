#!/bin/bash
if semistandard ; then
    rm -rf ./webapp/build
    mkdir ./webapp/build
    cp ./webapp/src/index.html ./webapp/build/index.html
    cp -r ./webapp/src/img ./webapp/build/ 
    lessc ./webapp/src/styles/style.less ./webapp/build/styles/style.css 
    browserify ./webapp/src/js/Main.js -o ./webapp/build/js/main.js
else
    echo "semistandard lint failed: aborting build process"
fi