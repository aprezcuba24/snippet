var OS = require('os');
var path = require('path');
var fs = require('fs');

const DEV_PARAM = 'dev';
let isDev = DEV_PARAM == process.argv.find((value) => {
  return value == 'dev';
});
let homeDir = path.join(OS.homedir(), '.snippet');
if (isDev) {
  homeDir = path.join(process.cwd(), 'data');
}
if (process.env.SNAP_USER_COMMON) {//Estoy dentro de una app snap
  homeDir = process.env.SNAP_USER_COMMON;
}
if (!fs.existsSync(homeDir)) {
  fs.mkdirSync(homeDir);
}
var dbDir = path.join(homeDir, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

let mongoPrograms = {
  linux: 'mongod',
  darwin: 'mongod_osx',
  win32: 'mongod.exe',
};

let ROOT_DIR = process.cwd();
if (process.env.SNAP) {//Estoy dentro de una app snap
  ROOT_DIR = process.env.SNAP;
}
let unpackDir = path.join(ROOT_DIR, 'unpackDir');
let mongodProgram = mongoPrograms[OS.platform()];
let mongoCommand = path.join(unpackDir, mongodProgram);

let mongoPort = 27117;

export const server = {
  db_connection: 'mongodb://localhost:' + mongoPort + '/snippet',
  mongoPort: mongoPort,
  mongod: mongoCommand,
  dbpath: dbDir,
};
