image-renamer
=============

An image renamer application using Node-Webkit.  It's basically a simple application I built for my wife when she
needs to rename and copy pictures from her SD card to our OneDrive folder.  Of course this can generally be used
to rename and copy files anywhere.

All jpg files in the source will be CRC'd and piped to the destination renamed like the following:

```
YYYY-MM-DD_HHmm_<original filename>.jpg
```

Any errors will be logged to the `error.log` file in the source directory.

###TODO
- Allow "try again" type logic with the failed files, using the transfer log.

###Attribution
Most of the hard work was done by someone more talented than myself:

- Node-Webkit: https://github.com/rogerwang/node-webkit
- EXIF: https://github.com/gomfunkel/node-exif
- Each: http://www.adaltas.com/projects/node-each/
- CRC: https://github.com/alexgorbatchev/node-crc

Feel free to use this for your own use... and REFUSE to pay for a product that does exactly this.