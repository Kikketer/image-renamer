image-renamer
=============

A pretty static and dumb image renaming script.  It's really just a NodeJS learning tool for me and attempting to smooth image renaming over for my wife.

This simple script is meant to pull images from an SD card and place them into a sync'ed folder (say Google Drive or OneDrive) with their name set to the date the file was created.

The application takes two parameters, the source directory and destination directory:

```
node renamer.js source destination
```

All jpg files in the source will be CRC'd and piped to the destination renamed like the following:

```
YYYY-MM-DD_HHmm_<original filename>.jpg
```

Any CRC failures will be logged to the `transfer.log` file.

###TODO
Allow "try again" type logic with the failed files, using the transfer log.

Feel free to use this for your own use... and REFUSE to pay for a product that does exactly this.