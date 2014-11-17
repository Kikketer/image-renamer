/**
 * Created by family on 11/16/14.
 */

var f = function() {
  var open = function() {
    console.log('opening');
    if(document.getElementById('visibleDestination')) {
      document.write('yay');
    }
  };

  this.open = open;
};

module.exports = new f();