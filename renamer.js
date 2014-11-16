var fs = require('fs');
var ExifImage = require('exif').ExifImage;
var each = require('each');
var crc = require('crc');

if (!process.argv[3]) {
  console.log('Usage: node renamer.js [source folder] [destination folder name]');
} else {
  var sourceDir = process.argv[2].match(/\/$/) ? process.argv[2] : process.argv[2] + '/';
  var destinationDir = process.argv[3].match(/\/$/) ? process.argv[3] : process.argv[3] + '/';
  var logFile = fs.createWriteStream(destinationDir + 'transfer.log');
  var errorCount = 0;
  var successCount = 0;

  fs.readdir(process.argv[2], function (err, files) {
    each(files)
      .on('item', function (filename, index, next) {
        if (filename.match(/\.jpg$/gi) && !filename.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{4}/i)) {
          console.log('Attempting ' + process.argv[2] + '/' + filename);
          try {
            new ExifImage({
              image: process.argv[2] + '/' + filename
            }, function (error, exifData) {
              if (error) console.log('Error: ' + error.message);
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

                // Now copy the file to the /tmp directory
                var readf = fs.createReadStream(sourceDir + filename);
                var writef = fs.createWriteStream(destinationDir + finalName);

                readf.on('end', function () {
                  var newCrc = crc.crc32(fs.readFileSync(destinationDir + finalName)).toString(16);
                  // Check to see if they match, if not delete and report
                  if(thisFileCRC !== newCrc) {
                    logFile.write(new Date() + ' - [CRC Mismatch]: ' + sourceDir + filename);
                    errorCount++;
                  }
                  else {
                    successCount++;
                  }

                  // Make this synchronous... just to keep our head straight
                  next();
                });

                readf.pipe(writef);
              }
            });
          } catch (error) {
            console.log('Error: ' + error.message);
          }
        }
      })
      .on('error', function (err) {
        console.log(err);
      })
      .on('end', function() {
        logFile.end();
        console.log('Rename completed.\n------------------------');
        console.log('Source: ' + sourceDir);
        console.log('Destination: ' + destinationDir);
        console.log('Files renamed: ' + successCount);
        console.log('ERRORS: ' + errorCount + '\n------------------------');
      });
  });
}