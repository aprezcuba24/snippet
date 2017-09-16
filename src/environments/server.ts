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
if (!fs.existsSync(homeDir)) {
  fs.mkdirSync(homeDir);
}
var dbDir = path.join(homeDir, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

let mongoPrograms = {
  linux: 'mongod',
  darwin: 'mongod',
  win32: 'mongod.exe',
};

let mongodProgram = mongoPrograms[OS.platform()];
let mongoCommand = path.join(process.cwd(), 'unpackDir', mongodProgram);

let mongoPort = 27117;

export const server = {
  db_connection: 'mongodb://localhost:' + mongoPort + '/snippet',
  mongoPort: mongoPort,
  mongod: mongoCommand,
  dbpath: dbDir,
};
