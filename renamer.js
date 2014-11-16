var fs = require('fs');
var ExifImage = require('exif').ExifImage;
var each = require('each');
var crc = require('crc');
var async = require('async');

if (!process.argv[3]) {
  console.log('Usage: node renamer.js [source folder] [destination folder name]');
} else {
  var sourceDir = process.argv[2].match(/\/$/) ? process.argv[2] : process.argv[2] + '/';
  var destinationDir = process.argv[3].match(/\/$/) ? process.argv[3] : process.argv[3] + '/';
  //var logFile = fs.createWriteStream(destinationDir + 'error.log');
  var errorCount = 0;
  var successCount = 0;

  console.log('Starting the transfer...');
  fs.readdir(sourceDir, function (err, files) {
    async.each(files, function (filename, callback) {
        //each(files)
        //  .on('item', function (filename, index, next) {
        if (filename.match(/\.jpg$/gi) && !filename.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{4}/i)) {
          //try {
            new ExifImage({
              image: sourceDir + filename
            }, function (error, exifData) {
              if (error) {
                //logFile.write(new Date() + ' - [EXIF Error]: ' + filename + ' - ' + error);
                console.log('[EXIF Error]: ' + error.message);
                errorCount++;
                //callback();
                //next();
              }
              else {
                var orig = exifData.exif.CreateDate;
                var dt = orig.split(' ')[0];
                var time = orig.split(' ')[1];
                dt = dt.replace(/:/g, '-');
                time = time.substr(0, time.length - 3);
                time = time.replace(/:/g, '');

                var finalName = dt + '_' + time + '_' + filename;

                // First get the CRC of the file before we move it
                var thisFileCRC = crc.crc32(fs.readFileSync(sourceDir + filename)).toString(16);

                // Setup the reader and writer streams
                var readf = fs.createReadStream(sourceDir + filename);
                var writef = fs.createWriteStream(destinationDir + finalName);

                // When the piping is finished, do some logic.
                readf.on('end', function () {
                  var newCrc = crc.crc32(fs.readFileSync(destinationDir + finalName)).toString(16);
                  // Check to see if they match, if not delete and report
                  if (thisFileCRC !== newCrc) {
                    //logFile.write(new Date() + ' - [CRC Mismatch]: ' + sourceDir + filename);
                    errorCount++;
                  }
                  else {
                    successCount++;
                    console.log(filename + ' -> ' + finalName);
                  }

                  // Make this synchronous... just to keep our head straight
                  //next();
                  //callback();
                });

                // Actually copy over the file via fancy Node piping
                readf.pipe(writef);
                //callback();
              }
            });
          //} catch (error) {
          //  console.log('[Crazy Error]: ' + error.message);
          //}
        }
        else {
          //next();
          //callback();
        }
        callback();
      },
      function (err) {
        console.log('done?');
        if (err) {
          //logFile.write(new Date() + ' - [Each Error]: ' + err);
          console.log('[Each Error]: ' + err);
        }
        else {
          console.log('\nRename completed.\n------------------------');
          console.log('Source: ' + sourceDir);
          console.log('Destination: ' + destinationDir);
          //console.log('Files renamed: ' + successCount);
          //console.log('ERRORS: ' + errorCount + '\n------------------------');
          console.log('------------------------');
          //logFile.end();
        }
      });
    //.on('error', function (err) {
    //  logFile.write(new Date() + ' - [Each Error]: ' + err);
    //  console.log('[Each Error]: ' + err);
    //})
    //.on('end', function () {
    //  logFile.end();
    //  console.log('\nRename completed.\n------------------------');
    //  console.log('Source: ' + sourceDir);
    //  console.log('Destination: ' + destinationDir);
    //  console.log('Files renamed: ' + successCount);
    //  console.log('ERRORS: ' + errorCount + '\n------------------------');
    //});
  });
}

var processFile = function (filename) {

};