/**
 * Created by gabello on 8/12/2015.
 */
  angular.module('quotes.persistence', [])
  .factory('DataModel', ['$q', function ($q) {
      var clazz = function (attributes) {
        var defaults = {
          QuoteIntent:null,
          Address: null,
          Vehicles: [],
          Drivers: [],
          Incidents:[]
        };
        _.extend(this, defaults, attributes);
      };
      // Class Methods
      _.extend(clazz.prototype, {});

      return clazz;
    }]);

