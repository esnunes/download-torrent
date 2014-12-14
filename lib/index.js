var ts = require('torrent-stream'),
    ProgressBar = require('progress'),
    rsvp = require('rsvp'),
    path = require('path');


module.exports = function (magnetUri, options) {
  var deferred = rsvp.defer();

  var engine = ts(magnetUri, {
    uploads: options.disableUpload ? false : undefined,
    path: options.outputDir
  });

  engine.on('ready', function () {
    var length = 0;
    var finished = engine.files.length;

    if (!options.quiet) console.log('downloading files:');

    engine.files.forEach(function (file) {
      length += file.length;

      if (!options.quiet) console.log('-', file.path);

      var stream = file.createReadStream();

      stream.on('data', function (chunk) {
        if (!options.quiet) bar.tick(chunk.length);
      });

      stream.on('end', function () {
        finished--;
        if (finished === 0) {
          var files = engine.files.map(function (file) {
            return path.join(options.outputDir, file.path);
          });
          engine.destroy(function () {
            deferred.resolve(files);
          });
        }
      });
    });

    if (!options.quiet) console.log('progress:');

    var bar = new ProgressBar('- [:bar] :percent :etas', { total: length });
    if (!options.quiet) bar.tick(0);
  });

  return deferred.promise;
};
