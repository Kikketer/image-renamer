var fs = require('fs');
var ExifImage = require('exif').ExifImage;
var each = require('each');

if (!process.argv[2]) {
    console.log('Usage: node renamer.js [pictures folder]');
} else {
    fs.readdir(process.argv[2], function(err, files) {
        each(files)
            .on('item', function(filename, index, next) {
            if (filename.match(/\.jpg$/gi) && !filename.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{4}/i)) {
                try {
                    new ExifImage({
                        image: filename
                    }, function(error, exifData) {
                        if (error) console.log('Error: ' + error.message);
                        else {
                            var orig = exifData.exif.CreateDate;
                            var dt = orig.split(' ')[0];
                            var time = orig.split(' ')[1];
                            dt = dt.replace(/:/g, '-');
                            time = time.substr(0, time.length - 3);
                            time = time.replace(/:/g, '');

                            var finalName = dt + '_' + time + '_' + filename;

                            fs.rename(filename, finalName, function() {
                                console.log('renamed: ' + filename + ' to ' + finalName);
                            });
                        }
                    });
                } catch (error) {
                    console.log('Error: ' + error.message);
                }
            }
            next();
        })
            .on('error', function(err) {
            console.log(err);
        });
    });
}