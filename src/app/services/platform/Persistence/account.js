/**
 * Created by gabello on 8/18/2015.
 */
angular.module('quotes.persistence')
  .factory('AccountModel', ['$q',
    function ($q) {
      var clazz = function (attributes) {
        var defaults = {
          PolicyStartDate:null
        };
        _.extend(this, defaults, attributes);
      };
      // Class Methods
      _.extend(clazz.prototype, {




        populateData: function (data) {
          _.extend(this, data);
        }
      });

      return clazz;
    }
  ]);
