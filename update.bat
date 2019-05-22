@echo off

:begin

call browserify ./src/CartesianSystemLite.js -o ./dist/CartesianSystemLite.js

    call timeout /t 5 /nobreak

goto begin