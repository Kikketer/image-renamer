/**
 * Created by family on 11/16/14.
 */

//var renamer = require('js/renamer.js');

$(function () {
  // Fire the fake click on file
  function chooseFile(name) {
    var chooser = $(name);
    chooser.trigger('click');
  }

  $('#visibleDestination').on('click', function (event) {
    chooseFile('#destination');
  });

  $('#visibleSource').on('click', function() {
    chooseFile('#source');
  });

  $('#destination').on('change', function() {
    $('#visibleDestination').val(this.files[0].path);
  });

  $('#source').on('change', function() {
    $('#visibleSource').val(this.files[0].path);
  });

  $(document).on('keydown', function(event) {
    if (event.keyCode == 'Q'.charCodeAt(0) && event.metaKey) {
      window.close();
    }
  });
});