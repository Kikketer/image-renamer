/**
 * Created by family on 11/16/14.
 */

var renamer = require('./js/renamer.js');

$(function () {
  // Fire the fake click on file
  function chooseFile(name) {
    var chooser = $(name);
    chooser.trigger('click');
  }

  $('#visibleDestination').on('click', function (event) {
    clearLoader();
    chooseFile('#destination');
  });

  $('#visibleSource').on('click', function() {
    clearLoader();
    chooseFile('#source');
  });

  $('#destination').on('change', function() {
    clearLoader();
    $('#visibleDestination').val(this.files[0].path);
  });

  $('#source').on('change', function() {
    clearLoader();
    $('#visibleSource').val(this.files[0].path);
  });

  $('#rename').on('click', function() {
    clearLoader();
    $('#visibleSource').parents('.form-group').removeClass('has-error');
    $('#visibleDestination').parents('.form-group').removeClass('has-error');

    var source = $('#visibleSource').val().trim();
    var destination = $('#visibleDestination').val().trim();

    if(source && destination) {
      renamer.getFiles(source, function(files) {
        var loadBar = $('<div>').addClass('loader-bar');
        var perWidth = 100 / files.length;
        $.each(files, function(index, file) {
          loadBar.append($('<div>').addClass('loader-segment').addClass('default').attr('id', file).css('width', perWidth + '%'));
        });
        $('body').append(loadBar);
      });

      renamer.rename(source, destination, eachCallback, completeCallback);
    }
    else {
      if(!source) {
        $('#visibleSource').parents('.form-group').addClass('has-error');
      }
      if(!destination) {
        $('#visibleDestination').parents('.form-group').addClass('has-error');
      }
    }

  });

  var eachCallback = function(err, filename) {
    if(err && err === 'Bad Exif') {
      $($('.loader-segment.default')[0]).removeClass('default').addClass('bg-warning');
    }
    else if(err && err === 'Copy Failure') {
      $($('.loader-segment.default')[0]).removeClass('default').addClass('bg-danger');
    }
    else {
      $($('.loader-segment.default')[0]).removeClass('default').addClass('bg-success');
    }
  };

  var completeCallback = function(err, log) {
    var complete = $('<div class="loader-complete-message">Complete! <a href="' + log + '">View Errors</a></div>');
    $('.loader-bar').append(complete);
  };

  var clearLoader = function() {
    $('.loader-bar').remove();
  };

  $(document).on('keydown', function(event) {
    if (event.keyCode == 'Q'.charCodeAt(0) && event.metaKey) {
      window.close();
    }
  });
});