#!/usr/bin/env node

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path');

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
      console.error(error.message || error)
      process.exit(1)
    });

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'out')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'VitrolaWifi-win32-ia32/'),
    authors: 'Renier Ricardo Figueredo',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'VitrolaWifi.exe',
    setupExe: 'VitrolaWifi.exe',
    setupIcon: path.join(rootPath, 'assets', 'app-icon', 'win', 'app.ico')
  })
}