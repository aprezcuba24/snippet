// var OS = require('os');
// var path = require('path');
// var fs = require('fs');
//
// let homeDir = path.join(OS.homedir(), '.snippet');
// if (!fs.existsSync(homeDir)){
//   fs.mkdirSync(homeDir);
// }
// var dbDir = path.join(homeDir, 'db');
// if (!fs.existsSync(dbDir)){
//   fs.mkdirSync(dbDir);
// }
//
// let mongodProgram = 'mongod';
// let mongoCommand = path.join(process.cwd(), 'unpackDir', mongodProgram);
//
// let mongoPort = 27117;
let mongoPort = 27017;

export const server = {
  db_connection: 'mongodb://localhost:' + mongoPort + '/snippet',
  // mongoPort: mongoPort,
  // mongod: mongoCommand,
  // dbpath: dbDir,
};
