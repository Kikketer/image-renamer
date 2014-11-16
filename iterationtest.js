var each = require('each');
var ExifImage = require('exif').ExifImage;
var fs = require('fs');
var crc = require('crc');

var sourceDir;
var destinationDir;
var errorCount = 0;
var successCount = 0;
var skipCount = 0;
var badExifCount = 0;
var totalJpg = 0;

var rename = function () {
  each()
    .files(sourceDir + '*.jpg')
    .files(sourceDir + '*.JPG')
    //.parallel(2)
    .on('item', function (filename, next) {
      console.log('----------\nFile: ', filename);
      totalJpg++;
      // ./sourcefault/2014-10-11_2345_DESC_1234.JPG
      if (filename.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{4}_[a-z,_,1-9]*\.jpg$/gi)) {
        console.log('Skipping');
        skipCount++;
        next();
      }
      else {
        getFilename(filename, function (newFilename) {
          if (!newFilename) {
            next();
            return;
          }
          copyFile(filename, newFilename, function () {
            console.log('Processing complete...');
            next();
          });
        });
      }
    })
    .on('error', function (err, errors) {
      console.log(err.message);
      errors.forEach(function (error) {
        console.log('  ' + error.message);
      });
    })
    .on('end', function () {
      console.log('\n=============');
      console.log('COMPLETE');
      console.log('Total JPGs: ' + totalJpg);
      console.log('Success: ' + successCount);
      console.log('Copy Error: ' + errorCount);
      console.log('Bad EXIF: ' + badExifCount);
      console.log('Skipped: ' + skipCount);
      console.log('=============');
    });
};

var getFilename = function (filename, callback) {
  new ExifImage({
    image: filename
  }, function (error, exifData) {
    if (error || !exifData || !exifData.exif || !exifData.exif.CreateDate) {
      console.log('Bad exif..');
      badExifCount++;
      callback();
      return;
    }

    var actualFilename = filename.match(/[a-z,0-9,_,\-,.]*$/gi)[0];
    var orig = exifData.exif.CreateDate;
    var dt = orig.split(' ')[0];
    var time = orig.split(' ')[1];
    dt = dt.replace(/:/g, '-');
    time = time.substr(0, time.length - 3);
    time = time.replace(/:/g, '');

    var finalName = destinationDir + dt + '_' + time + '_' + actualFilename;

    console.log(filename + ' -> ' + finalName);

    callback(finalName);
  });
};

var copyFile = function (original, newname, callback) {
  // First get the CRC of the file before we move it
  var thisFileCRC = crc.crc32(fs.readFileSync(original)).toString(16);

  // Setup the reader and writer streams
  var readf = fs.createReadStream(original);
  var writef = fs.createWriteStream(newname);

  // When the piping is finished, do some logic.
  readf.on('end', function () {
    var newCrc = crc.crc32(fs.readFileSync(newname)).toString(16);
    // Check to see if they match, if not delete and report
    if (thisFileCRC !== newCrc) {
      //logFile.write(new Date() + ' - [CRC Mismatch]: ' + sourceDir + filename);
      console.log('[CRC Mismatch]: ' + original);
      errorCount++;
    }
    else {
      successCount++;
    }

    callback();
  });

  // Actually copy over the file via fancy Node piping
  readf.pipe(writef);
};

// Check and go
if (!process.argv[3]) {
  console.log('Usage: node renamer.js [source folder] [destination folder]');
} else {
  sourceDir = process.argv[2].match(/\/$/) ? process.argv[2] : process.argv[2] + '/';
  destinationDir = process.argv[3].match(/\/$/) ? process.argv[3] : process.argv[3] + '/';
  rename();
}