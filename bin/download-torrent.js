#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    rsvp = require('rsvp'),
    downloader = require('..');


var pkgInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), { encoding: 'utf8' }));


program
  .version(pkgInfo.version)
  .usage('[options] [magnet uri]')
  .option('-q, --quiet', 'Quiet mode', false)
  .option('-i, --stdin', 'Read magnet uri from stdin', false)
  .option('-o, --stdout', 'Output list of files after download, implies --quiet', false)
  .option('-d, --output-dir [dir]', 'Output directory [' + process.cwd() + ']', process.cwd())
  .option('-u, --disable-upload', 'Disable upload', false)
  .parse(process.argv);


if (!program.stdin && !program.args.length) return program.help();


var magnetUri = function () {
  if (!program.stdin) return rsvp.resolve(program.args[0]);

  var deferred = rsvp.defer();

  var uri = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (chunk) {
    uri += chunk;
  });

  process.stdin.on('end', function () {
    uri = uri.replace(/\n/g, '');
    deferred.resolve(uri);
  });

  return deferred.promise;
};


var download = function (magnetUri) {
  var opts = {
    extension: program.extension,
    outputDir: program.outputDir,
    disableUpload: program.disableUpload,
    quiet: program.quiet || program.stdout
  };

  return downloader(magnetUri, opts);
};


var success = function (files) {
  if (program.stdout) {
    files.forEach(function (file) {
      console.log(file);
    });
  }

  process.exit(0);
};


var fail = function () {
  process.exit(1);
};


magnetUri()
  .then(download)
  .then(success, fail);
