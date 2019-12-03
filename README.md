
## Quick start
```bash
yarn install

# 

yarn dev
```

## Overview
- webpack 4
- electron
- electron-package
- react 16
- react-router 5
- ant-design
- less

## DevTools

Toggle DevTools:

* OSX: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
* Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
* Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## Packaging

Modify [package.config.js](./config/package.config.js) to edit package info.

For a full list of options see: https://github.com/electron-userland/electron-packager/blob/master/docs/api.md.

Create a package for OSX, Windows and Linux
```
yarn pack
```

Or target a specific platform
```
yarn pack:mac
yarn pack:win
yarn pack:linux
```
test remote

How to install:

- Install python2.7
- Install NodeJS
- Install all the required tools and configurations using Microsoft's windows-build-tools using npm install --global --production windows-build-tools from an elevated PowerShell or CMD.exe (run as Administrator).