/**
 * Created by family on 11/16/14.
 */

var f = function() {
  this.giggity = function() {
    console.log('giggity');
  }
};

module.exports = new f();